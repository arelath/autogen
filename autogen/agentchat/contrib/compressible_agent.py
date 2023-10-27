from typing import Callable, Dict, Optional, Union, Tuple, List, Any
from autogen import oai
from autogen import Agent, ConversableAgent
import copy
import asyncio
import logging
from autogen.token_count_utils import count_token, get_max_token_limit, num_tokens_from_functions

try:
    from termcolor import colored
except ImportError:

    def colored(x, *args, **kwargs):
        return x


logger = logging.getLogger(__name__)


class CompressibleAgent(ConversableAgent):
    """(Experimental) CompressibleAgent agent. While this agent retains all the default functionalities of the `AssistantAgent`,
        it also provides the added feature of compression when activated through the `compress_config` setting.

    `compress_config` is set to False by default, making this agent equivalent to the `AssistantAgent`.
    The default system message is the same as AssistantAgent.
    `human_input_mode` is default to "NEVER"
    and `code_execution_config` is default to False.
    This agent doesn't execute code or function call by default.
    """

    DEFAULT_SYSTEM_MESSAGE = """You are a helpful AI assistant.
Solve tasks using your coding and language skills.
In the following cases, suggest python code (in a python coding block) or shell script (in a sh coding block) for the user to execute.
    1. When you need to collect info, use the code to output the info you need, for example, browse or search the web, download/read a file, print the content of a webpage or a file, get the current date/time, check the operating system. After sufficient info is printed and the task is ready to be solved based on your language skill, you can solve the task by yourself.
    2. When you need to perform some task with code, use the code to perform the task and output the result. Finish the task smartly.
Solve the task step by step if you need to. If a plan is not provided, explain your plan first. Be clear which step uses code, and which step uses your language skill.
When using code, you must indicate the script type in the code block. The user cannot provide any other feedback or perform any other action beyond executing the code you suggest. The user can't modify your code. So do not suggest incomplete code which requires users to modify. Don't use a code block if it's not intended to be executed by the user.
If you want the user to save the code in a file before executing it, put # filename: <filename> inside the code block as the first line. Don't include multiple code blocks in one response. Do not ask users to copy and paste the result. Instead, use 'print' function for the output when relevant. Check the execution result returned by the user.
If the result indicates there is an error, fix the error and output the code again. Suggest the full code instead of partial code or code changes. If the error can't be fixed or if the task is not solved even after the code is executed successfully, analyze the problem, revisit your assumption, collect additional info you need, and think of a different approach to try.
When you find an answer, verify the answer carefully. Include verifiable evidence in your response if possible.
Reply "TERMINATE" in the end when everything is done.
    """

    def __init__(
        self,
        name: str,
        system_message: Optional[str] = DEFAULT_SYSTEM_MESSAGE,
        is_termination_msg: Optional[Callable[[Dict], bool]] = None,
        max_consecutive_auto_reply: Optional[int] = None,
        human_input_mode: Optional[str] = "NEVER",
        function_map: Optional[Dict[str, Callable]] = None,
        code_execution_config: Optional[Union[Dict, bool]] = False,
        llm_config: Optional[Union[Dict, bool]] = None,
        default_auto_reply: Optional[Union[str, Dict, None]] = "",
        compress_config: Optional[Dict] = False,
    ):
        """
        Args:
            name (str): agent name.
            system_message (str): system message for the ChatCompletion inference.
                Please override this attribute if you want to reprogram the agent.
            llm_config (dict): llm inference configuration.
                Please refer to [Completion.create](/docs/reference/oai/completion#create)
                for available options.
            is_termination_msg (function): a function that takes a message in the form of a dictionary
                and returns a boolean value indicating if this received message is a termination message.
                The dict can contain the following keys: "content", "role", "name", "function_call".
            max_consecutive_auto_reply (int): the maximum number of consecutive auto replies.
                default to None (no limit provided, class attribute MAX_CONSECUTIVE_AUTO_REPLY will be used as the limit in this case).
                The limit only plays a role when human_input_mode is not "ALWAYS".
            compress_config (dict or False): config for compression before oai_reply. Default to None, meaning no compression will be used and
                the conversation will terminate when the token count exceeds the limit. You should contain the following keys:
                - "mode" (Optional, str, default to "COMPRESS"): Choose from ["COMPRESS", "TERMINATE"]. "COMPRESS": enable the compression agent.
                    "TERMINATE": terminate the conversation when the token count exceeds the limit.
                - "agent" (Optional, "Agent", default CompressionAgent): the agent to call before oai_reply. the `generate_reply` method from this Agent will be called.
                - "trigger_count" (Optional, float, int, default to 0.7): the threshold to trigger compression.
                    If a float between (0, 1], it is the percentage of token used. if a int, it is the number of tokens used.
                - "async" (Optional, bool, default to False): whether to compress asynchronously.
                - "broadcast" (Optional, bool, default to True): whether to update the compressed message history to sender.
            **kwargs (dict): Please refer to other kwargs in
                [ConversableAgent](/autogen/docs/reference/agentchat/contrib/conversable_agent).
        """
        super().__init__(
            name=name,
            system_message=system_message,
            is_termination_msg=is_termination_msg,
            max_consecutive_auto_reply=max_consecutive_auto_reply,
            human_input_mode=human_input_mode,
            function_map=function_map,
            code_execution_config=code_execution_config,
            llm_config=llm_config,
            default_auto_reply=default_auto_reply,
        )

        if compress_config:
            if compress_config is True:
                self.compress_config = {}
            if not isinstance(compress_config, dict):
                raise ValueError("compress_config must be a dict or True/False.")

            assert compress_config.get("mode", "COMPRESS") in [
                "COMPRESS",
                "TERMINATE",
                "CUSTOMIZED",
            ], "compress_config['mode'] must be 'COMPRESS' or 'TERMINATE' or 'CUSTOMIZED'"

            self.compress_config = {
                "mode": "COMPRESS",
                "compress_function": None,
                "trigger_count": 0.7,
                "async": False,
                "broadcast": True,
                "verbose": False,
            }
            self.compress_config.update(compress_config)
            # convert trigger_count to int, default to 0.7
            trigger_count = self.compress_config["trigger_count"]
            if isinstance(trigger_count, float) and 0 < trigger_count < 1:
                self.compress_config["trigger_count"] = int(
                    trigger_count * get_max_token_limit(self.llm_config["model"])
                )

            if self.compress_config["mode"] == "CUSTOMIZED":
                assert (
                    "compress_function" in self.compress_config
                ), "compress_function must be provided when mode is 'CUSTOMIZED'"
            elif self.compress_config["compress_function"] is not None:
                print("Warning: compress_function is provided but mode is not 'CUSTOMIZED'.")

        else:
            self.compress_config = False

        self._reply_func_list.clear()
        self.register_reply([Agent, None], ConversableAgent.generate_oai_reply)
        self.register_reply([Agent], CompressibleAgent.on_oai_token_limit)  # check token limit
        self.register_reply([Agent, None], ConversableAgent.generate_code_execution_reply)
        self.register_reply([Agent, None], ConversableAgent.generate_function_call_reply)
        self.register_reply([Agent, None], ConversableAgent.check_termination_and_human_reply)

    def generate_reply(
        self,
        messages: Optional[List[Dict]] = None,
        sender: Optional[Agent] = None,
        exclude: Optional[List[Callable]] = None,
    ) -> Union[str, Dict, None]:
        """

        Note on difference from ConversableAgent.generate_reply:
        The following lines are removed:
        ```
        if messages is None:
            messages = self._oai_messages[sender]
        ```
        Reason:
        1. It will make no difference because every `generate_<>_reply` (e.g. generate_oai_reply) has the exact two lines
            to replace `messages` with `self._oai_messages[sender]` if `messages` is None.

        2. Why needed for compression:
            - The `on_oai_token_limit` will modify `self._oai_messages[sender]`.
            - In `generate_oai_reply`, `messages` and `sender` are passed in (line 179).
            - If the two lines are not removed here, messages are never None, and `generate_oai_reply` will
                always use `messages`, which is not compressed.
            - If the two lines are removed, `generate_oai_reply` will find that `messages` is None and
                use `self._oai_messages[sender]` instead, which is compressed.
                (From 1, generate_oai_reply has the exact two lines)
        """
        if all((messages is None, sender is None)):
            error_msg = f"Either {messages=} or {sender=} must be provided."
            logger.error(error_msg)
            raise AssertionError(error_msg)

        # removed here

        for reply_func_tuple in self._reply_func_list:
            reply_func = reply_func_tuple["reply_func"]
            if exclude and reply_func in exclude:
                continue
            if asyncio.coroutines.iscoroutinefunction(reply_func):
                continue
            if self._match_trigger(reply_func_tuple["trigger"], sender):
                final, reply = reply_func(self, messages=messages, sender=sender, config=reply_func_tuple["config"])
                if final:
                    return reply
        return self._default_auto_reply

    def compute_init_token_count(self):
        """Check if the agent is LLM-based and compute the initial token count."""
        if self.llm_config is False:
            return 0

        func_count = 0
        if "functions" in self.llm_config:
            func_count = num_tokens_from_functions(self.llm_config["functions"], self.llm_config["model"])

        return func_count + count_token(self._oai_system_message, self.llm_config["model"])

    def on_oai_token_limit(
        self,
        messages: Optional[List[Dict]] = None,
        sender: Optional[Agent] = None,
        config: Optional[Any] = None,
    ) -> Tuple[bool, Union[str, Dict, None]]:
        """(Experimental) Compress previous messages when a threshold of tokens is reached.

        TODO: async compress
        TODO: maintain a list for old oai messages (messages before compression)
        """
        llm_config = self.llm_config if config is None else config
        if self.compress_config is False:
            return False, None
        if messages is None:
            messages = self._oai_messages[sender]

        # 1. mode = "TERMINATE", terminate the agent if no token left.
        token_used = self.compute_init_token_count() + count_token(messages, llm_config["model"])
        max_token = max(get_max_token_limit(llm_config["model"]), llm_config.get("max_token", 0))
        if self.compress_config["mode"] == "TERMINATE":
            if max_token - token_used <= 0:
                # Teminate if no token left.
                print(
                    colored(
                        f"Warning: Terminate Agent \"{self.name}\" due to no token left for oai reply. max token for {llm_config['model']}: {max_token}, existed token count: {token_used}",
                        "yellow",
                    ),
                    flush=True,
                )
                return True, None
            return False, None

        # on_oai_token_limit requires a sender. Otherwise, the compressed messages cannot be saved
        # if token_used is less than trigger_count, no compression will be used.
        if sender is None or token_used < self.compress_config["trigger_count"]:
            return False, None

        # 2. mode = "COMPRESS" or mode = "CUSTOMIZED" , compress the messages
        copied_messages = copy.deepcopy(messages)
        if self.compress_config["mode"] == "COMPRESS":
            is_compress_success, compressed_messages = self.compress_messages(copied_messages)
        elif self.compress_config["mode"] == "CUSTOMIZED":
            is_compress_success, compressed_messages = self.compress_config["compress_function"](copied_messages)
        else:
            raise ValueError(f"Unknown compression mode: {self.compress_config['mode']}")

        # update message history with compressed messages
        if is_compress_success:
            to_print = (
                "Token Count (of msgs after first prompt): Before compression: {} After: {} | "
                "Total prompt token count after compression: {}".format(
                    count_token(self._oai_messages[sender][1:], llm_config["model"]),
                    count_token(compressed_messages[1:], llm_config["model"]),
                    count_token(compressed_messages, llm_config["model"]) + self.compute_init_token_count(),
                )
            )
            print(colored(to_print, "magenta"), flush=True)
            print("-" * 80, flush=True)

            self._oai_messages[sender] = compressed_messages
            if self.compress_config["broadcast"]:
                sender._oai_messages[self] = copy.deepcopy(compressed_messages)

        # sucessfully compressed, return False, None for generate_oai_reply to be called with the updated messages
        return False, None

    def compress_messages(
        self,
        messages: Optional[List[Dict]] = None,
        config: Optional[Any] = None,
    ) -> Tuple[bool, Union[str, Dict, None, List]]:
        """Compress a list of messages into one message.

        The first message (the initial prompt) will not be compressed.
        The rest of the messages will be compressed into one message, the model is asked to distinuish the role of each message: USER, ASSISTANT, FUNCTION_CALL, FUNCTION_RETURN.
        Check out the compress_sys_msg.

        TODO: model used in compression agent is different from assistant agent: For example, if original model used by is gpt-4; we start compressing at 70% of usage, 70% of 8092 = 5664; and we use gpt 3.5 here max_toke = 4096, it will raise error. choosinng model automatically?
        """
        # 1. use the same config for compression and remove functions from llm_config
        llm_config = copy.deepcopy(self.llm_config) if config is None else copy.deepcopy(config)
        if llm_config is False or messages is None:
            return False, None
        if "functions" in llm_config:
            del llm_config["functions"]

        # 2. stop if there is only one message in the list
        if len(messages) <= 1:
            logger.warning(f"The first message contains {count_token(messages)} tokens, which will not be compressed.")
            return False, None

        # 3. put all history into one, except the first one
        if self.compress_config["verbose"]:
            print(colored("*" * 30 + "Start compressing the following content:" + "*" * 30, "magenta"), flush=True)

        compressed_prompt = "Below is the compressed content from the previous conversation, evaluate the process and continue if necessary:\n"
        chat_to_compress = "To be compressed:\n"

        for m in messages[1:]:
            if m.get("role") == "function":
                chat_to_compress += f"##FUNCTION_RETURN## (from function \"{m['name']}\"): \n{m['content']}\n"
            else:
                if "name" in m:
                    # {"name" : "Bob", "role" : "assistant"} -> ##Bob(ASSISTANT)##
                    chat_to_compress += f"##{m['name']}({m['role'].upper()})## {m['content']}\n"
                elif m["content"] is not None:
                    if compressed_prompt in m["content"]:
                        # remove the compressed_prompt from the content
                        tmp = m["content"].replace(compressed_prompt, "")
                        chat_to_compress += f"{tmp}\n"
                    else:
                        chat_to_compress += f"##{m['role'].upper()}## {m['content']}\n"

                if "function_call" in m:
                    if (
                        m["function_call"].get("name", None) is None
                        or m["function_call"].get("arguments", None) is None
                    ):
                        chat_to_compress += f"##FUNCTION_CALL## {m['function_call']}\n"
                    else:
                        chat_to_compress += f"##FUNCTION_CALL## \nName: {m['function_call']['name']}\nArgs: {m['function_call']['arguments']}\n"

        chat_to_compress = [{"role": "user", "content": chat_to_compress}]

        if self.compress_config["verbose"]:
            print(chat_to_compress[0]["content"])

        # 4. use LLM to compress
        compress_sys_msg = """You are a helpful AI assistant that will compress messages.
Rules:
1. Please summarize each of the message and reserve the titles: ##USER##, ##ASSISTANT##, ##FUNCTION_CALL##, ##FUNCTION_RETURN##, ##SYSTEM##, ##<Name>(<Title>)## (e.g. ##Bob(ASSISTANT)##).
2. Context after ##USER##, ##ASSISTANT## (and ##<Name>(<Title>)##): compress the content and reserve important information. If there is big chunk of code, please use ##CODE## to indicate and summarize what the code is doing with as few words as possible and include details like exact numbers and defined variables.
3. Context after ##FUNCTION_CALL##: Keep the exact content if it is short. Otherwise, summarize/compress it and reserve names (func_name, argument names).
4. Context after ##FUNCTION_RETURN## (or code return): Keep the exact content if it is short. Summarize/compress if it is too long, you should note what the function has achieved and what the return value is.
"""
        try:
            response = oai.ChatCompletion.create(
                context=None,
                messages=[{"role": "system", "content": compress_sys_msg}] + chat_to_compress,
                **llm_config,
            )
        except Exception as e:
            print(colored(f"Failed to compress the content due to {e}", "red"), flush=True)
            return False, None

        compressed_message = oai.ChatCompletion.extract_text_or_function_call(response)[0]
        assert isinstance(compressed_message, str), f"compressed_message should be a string: {compressed_message}"
        if self.compress_config["verbose"]:
            print(
                colored("*" * 30 + "Content after compressing:" + "*" * 30, "magenta"),
                flush=True,
            )
            print(compressed_message, colored("\n" + "*" * 80, "magenta"))

        # 5. add compressed message to the first message and return
        return True, [
            messages[0],
            {
                "content": compressed_prompt + compressed_message,
                "role": "system",
            },
        ]