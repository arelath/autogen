"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7519],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var a=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=p(n),g=i,m=d["".concat(s,".").concat(g)]||d[g]||c[g]||o;return n?a.createElement(m,r(r({ref:t},u),{},{components:n})):a.createElement(m,r({ref:t},u))}));function g(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,r=new Array(o);r[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,r[1]=l;for(var p=2;p<o;p++)r[p]=n[p];return a.createElement.apply(null,r)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9356:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>r,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var a=n(3117),i=(n(7294),n(3905));const o={title:"Agent AutoBuild - Automatically Building Multi-agent Systems",authors:["LinxinS97","jieyuz2"],tags:["LLM","research"]},r=void 0,l={permalink:"/autogen/blog/2023/11/26/Agent-AutoBuild",source:"@site/blog/2023-11-26-Agent-AutoBuild/index.mdx",title:"Agent AutoBuild - Automatically Building Multi-agent Systems",description:"Overall structure of AutoBuild",date:"2023-11-26T00:00:00.000Z",formattedDate:"November 26, 2023",tags:[{label:"LLM",permalink:"/autogen/blog/tags/llm"},{label:"research",permalink:"/autogen/blog/tags/research"}],readingTime:6.815,truncated:!1,authors:[{name:"Linxin Song",title:"MS student at Waseda University",url:"https://linxins97.github.io/",imageURL:"https://github.com/LinxinS97.png",key:"LinxinS97"},{name:"Jieyu Zhang",title:"PhD student at University of Washington",url:"https://jieyuz2.github.io/",imageURL:"https://github.com/jieyuz2.png",key:"jieyuz2"}],prevItem:{title:"AutoGen Studio: Interactively Explore Multi-Agent Workflows",permalink:"/autogen/blog/2023/12/01/AutoGenStudio"},nextItem:{title:"How to Assess Utility of LLM-powered Applications?",permalink:"/autogen/blog/2023/11/20/AgentEval"}},s={authorsImageUrls:[void 0,void 0]},p=[{value:"Introduction",id:"introduction",children:[],level:2},{value:"Installation",id:"installation",children:[],level:2},{value:"Basic Example",id:"basic-example",children:[{value:"Step 1: prepare configurations",id:"step-1-prepare-configurations",children:[],level:3},{value:"Step 2: create an AgentBuilder instance",id:"step-2-create-an-agentbuilder-instance",children:[],level:3},{value:"Step 3: specify the building task",id:"step-3-specify-the-building-task",children:[],level:3},{value:"Step 4: build group chat agents",id:"step-4-build-group-chat-agents",children:[],level:3},{value:"Step 5: execute the task",id:"step-5-execute-the-task",children:[],level:3},{value:"Step 6 (Optional): clear all agents and prepare for the next task",id:"step-6-optional-clear-all-agents-and-prepare-for-the-next-task",children:[],level:3}],level:2},{value:"Save and Load",id:"save-and-load",children:[],level:2},{value:"Use OpenAI Assistant",id:"use-openai-assistant",children:[],level:2},{value:"(Experimental) Use Open-source LLM",id:"experimental-use-open-source-llm",children:[],level:2},{value:"Future work/Roadmap",id:"future-workroadmap",children:[],level:2},{value:"Summary",id:"summary",children:[],level:2}],u={toc:p};function c(e){let{components:t,...o}=e;return(0,i.kt)("wrapper",(0,a.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Overall structure of AutoBuild",src:n(7665).Z})),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"TL;DR:"),"\nIntroducing ",(0,i.kt)("strong",{parentName:"p"},"AutoBuild"),", building multi-agent system automatically, fast, and easily for complex tasks with minimal\nuser prompt required, powered by a new designed class ",(0,i.kt)("strong",{parentName:"p"},"AgentBuilder"),". AgentBuilder also supports open-source LLMs by\nleveraging ",(0,i.kt)("a",{parentName:"p",href:"https://docs.vllm.ai/en/latest/index.html"},"vLLM")," and ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/lm-sys/FastChat"},"FastChat"),".\nCheckout example notebooks and source code for reference:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/microsoft/autogen/blob/main/notebook/autobuild_basic.ipynb"},"AutoBuild Examples")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/microsoft/autogen/blob/main/autogen/agentchat/contrib/agent_builder.py"},"AgentBuilder"))),(0,i.kt)("h2",{id:"introduction"},"Introduction"),(0,i.kt)("p",null,"In this blog, we introduce ",(0,i.kt)("strong",{parentName:"p"},"AutoBuild"),", a pipeline that can automatically build multi-agent systems for complex tasks.\nSpecifically, we design a new class called ",(0,i.kt)("strong",{parentName:"p"},"AgentBuilder"),", which will complete the generation of participant expert agents\nand the construction of group chat automatically after the user provides descriptions of a building task and an execution task."),(0,i.kt)("p",null,"AgentBuilder supports open-source models on Hugging Face powered by ",(0,i.kt)("a",{parentName:"p",href:"https://docs.vllm.ai/en/latest/index.html"},"vLLM"),"\nand ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/lm-sys/FastChat"},"FastChat"),". Once the user chooses to use open-source LLM, AgentBuilder will set\nup an endpoint server automatically without any user participation."),(0,i.kt)("h2",{id:"installation"},"Installation"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"AutoGen:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip install pyautogen[autobuild]\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"(Optional: if you want to use open-source LLMs) vLLM and FastChat")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"pip install vllm fastchat\n")),(0,i.kt)("h2",{id:"basic-example"},"Basic Example"),(0,i.kt)("p",null,"In this section, we provide a step-by-step example of how to use AgentBuilder to build a multi-agent system for a specific task."),(0,i.kt)("h3",{id:"step-1-prepare-configurations"},"Step 1: prepare configurations"),(0,i.kt)("p",null,"First, we need to prepare the Agent configurations.\nSpecifically, a config path containing the model name and API key, and a default config for each agent, are required."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"config_file_or_env = '/home/elpis_ubuntu/LLM/autogen/OAI_CONFIG_LIST'  # modify path\ndefault_llm_config = {\n    'temperature': 0\n}\n")),(0,i.kt)("h3",{id:"step-2-create-an-agentbuilder-instance"},"Step 2: create an AgentBuilder instance"),(0,i.kt)("p",null,"Then, we create an AgentBuilder instance with the config path and default config.\nYou can also specific the builder model and agent model, which are the LLMs used for building and agent respectively."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"from autogen.agentchat.contrib.agent_builder import AgentBuilder\n\nbuilder = AgentBuilder(config_file_or_env=config_file_or_env, builder_model='gpt-4-1106-preview', agent_model='gpt-4-1106-preview')\n")),(0,i.kt)("h3",{id:"step-3-specify-the-building-task"},"Step 3: specify the building task"),(0,i.kt)("p",null,"Specify a building task with a general description. Building task will help the build manager (a LLM) decide what agents should be built.\nNote that your building task should have a general description of the task. Adding some specific examples is better."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},'building_task = "Find a paper on arxiv by programming, and analyze its application in some domain. For example, find a latest paper about gpt-4 on arxiv and find its potential applications in software."\n')),(0,i.kt)("h3",{id:"step-4-build-group-chat-agents"},"Step 4: build group chat agents"),(0,i.kt)("p",null,"Use ",(0,i.kt)("inlineCode",{parentName:"p"},"build()")," to let the build manager (with a ",(0,i.kt)("inlineCode",{parentName:"p"},"builder_model")," as backbone) complete the group chat agents generation.\nIf you think coding is necessary for your task, you can use ",(0,i.kt)("inlineCode",{parentName:"p"},"coding=True")," to add a user proxy (a local code interpreter) into the agent list as:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"agent_list, agent_configs = builder.build(building_task, default_llm_config, coding=True)\n")),(0,i.kt)("p",null,"If ",(0,i.kt)("inlineCode",{parentName:"p"},"coding")," is not specified, AgentBuilder will determine on its own whether the user proxy should be added or not according to the task.\nThe generated ",(0,i.kt)("inlineCode",{parentName:"p"},"agent_list")," is a list of ",(0,i.kt)("inlineCode",{parentName:"p"},"AssistantAgent")," instances.\nIf ",(0,i.kt)("inlineCode",{parentName:"p"},"coding")," is true, a user proxy (a ",(0,i.kt)("inlineCode",{parentName:"p"},"UserProxyAssistant")," instance) will be added as the first element to the ",(0,i.kt)("inlineCode",{parentName:"p"},"agent_list"),".\n",(0,i.kt)("inlineCode",{parentName:"p"},"agent_configs")," is a list of agent configurations including agent name, backbone LLM model, and system message.\nFor example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'// an example of agent_configs. AgentBuilder will generate agents with the following configurations.\n[\n    {\n        "name": "ArXiv_Data_Scraper_Developer",\n        "model": "gpt-4-1106-preview",\n        "system_message": "You are now in a group chat. You need to complete a task with other participants. As an ArXiv_Data_Scraper_Developer, your focus is to create and refine tools capable of intelligent search and data extraction from arXiv, honing in on topics within the realms of computer science and medical science. Utilize your proficiency in Python programming to design scripts that navigate, query, and parse information from the platform, generating valuable insights and datasets for analysis. \\n\\nDuring your mission, it\\u2019s not just about formulating queries; your role encompasses the optimization and precision of the data retrieval process, ensuring relevance and accuracy of the information extracted. If you encounter an issue with a script or a discrepancy in the expected output, you are encouraged to troubleshoot and offer revisions to the code you find in the group chat.\\n\\nWhen you reach a point where the existing codebase does not fulfill task requirements or if the operation of provided code is unclear, you should ask for help from the group chat manager. They will facilitate your advancement by providing guidance or appointing another participant to assist you. Your ability to adapt and enhance scripts based on peer feedback is critical, as the dynamic nature of data scraping demands ongoing refinement of techniques and approaches.\\n\\nWrap up your participation by confirming the user\'s need has been satisfied with the data scraping solutions you\'ve provided. Indicate the completion of your task by replying \\"TERMINATE\\" in the group chat.",\n        "description": "ArXiv_Data_Scraper_Developer is a specialized software development role requiring proficiency in Python, including familiarity with web scraping libraries such as BeautifulSoup or Scrapy, and a solid understanding of APIs and data parsing. They must possess the ability to identify and correct errors in existing scripts and confidently engage in technical discussions to improve data retrieval processes. The role also involves a critical eye for troubleshooting and optimizing code to ensure efficient data extraction from the ArXiv platform for research and analysis purposes."\n    },\n    ...\n]\n')),(0,i.kt)("h3",{id:"step-5-execute-the-task"},"Step 5: execute the task"),(0,i.kt)("p",null,"Let agents generated in ",(0,i.kt)("inlineCode",{parentName:"p"},"build()")," complete the task collaboratively in a group chat."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},'import autogen\n\ndef start_task(execution_task: str, agent_list: list, llm_config: dict):\n    config_list = autogen.config_list_from_json(config_file_or_env, filter_dict={"model": ["gpt-4-1106-preview"]})\n\n    group_chat = autogen.GroupChat(agents=agent_list, messages=[], max_round=12)\n    manager = autogen.GroupChatManager(\n        groupchat=group_chat, llm_config={"config_list": config_list, **llm_config}\n    )\n    agent_list[0].initiate_chat(manager, message=execution_task)\n\nstart_task(\n    execution_task="Find a recent paper about gpt-4 on arxiv and find its potential applications in software.",\n    agent_list=agent_list,\n    llm_config=default_llm_config\n)\n')),(0,i.kt)("h3",{id:"step-6-optional-clear-all-agents-and-prepare-for-the-next-task"},"Step 6 (Optional): clear all agents and prepare for the next task"),(0,i.kt)("p",null,"You can clear all agents generated in this task by the following code if your task is completed or if the next task is largely different from the current task."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"builder.clear_all_agents(recycle_endpoint=True)\n")),(0,i.kt)("p",null,"If the agent's backbone is an open-source LLM, this process will also shut down the endpoint server. More details are in the next section.\nIf necessary, you can use ",(0,i.kt)("inlineCode",{parentName:"p"},"recycle_endpoint=False")," to retain the previous open-source LLM's endpoint server."),(0,i.kt)("h2",{id:"save-and-load"},"Save and Load"),(0,i.kt)("p",null,"You can save all necessary information of the built group chat agents by"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"saved_path = builder.save()\n")),(0,i.kt)("p",null,"Configurations will be saved in JSON format with the following content:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},'// FILENAME: save_config_TASK_MD5.json\n{\n    "building_task": "Find a paper on arxiv by programming, and analysis its application in some domain. For example, find a latest paper about gpt-4 on arxiv and find its potential applications in software.",\n    "agent_configs": [\n        {\n            "name": "...",\n            "model": "...",\n            "system_message": "...",\n            "description": "..."\n        },\n        ...\n    ],\n    "manager_system_message": "...",\n    "code_execution_config": {...},\n    "default_llm_config": {...}\n}\n')),(0,i.kt)("p",null,"You can provide a specific filename, otherwise, AgentBuilder will save config to the current path with the generated filename ",(0,i.kt)("inlineCode",{parentName:"p"},"save_config_TASK_MD5.json"),"."),(0,i.kt)("p",null,"You can load the saved config and skip the building process. AgentBuilder will create agents with those information without prompting the build manager."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"new_builder = AgentBuilder(config_file_or_env=config_file_or_env)\nagent_list, agent_config = new_builder.load(saved_path)\nstart_task(...)  # skip build()\n")),(0,i.kt)("h2",{id:"use-openai-assistant"},"Use OpenAI Assistant"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://platform.openai.com/docs/assistants/overview"},"Assistants API")," allows you to build AI assistants within your own applications.\nAn Assistant has instructions and can leverage models, tools, and knowledge to respond to user queries.\nAutoBuild also supports the assistant API by adding ",(0,i.kt)("inlineCode",{parentName:"p"},"use_oai_assistant=True")," to ",(0,i.kt)("inlineCode",{parentName:"p"},"build()"),"."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-python"},"# Transfer to the OpenAI Assistant API.\nagent_list, agent_config = new_builder.build(building_task, default_llm_config, use_oai_assistant=True)\n...\n")),(0,i.kt)("h2",{id:"experimental-use-open-source-llm"},"(Experimental) Use Open-source LLM"),(0,i.kt)("p",null,"AutoBuild supports open-source LLM by ",(0,i.kt)("a",{parentName:"p",href:"https://docs.vllm.ai/en/latest/index.html"},"vLLM")," and ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/lm-sys/FastChat"},"FastChat"),".\nCheck the supported model list ",(0,i.kt)("a",{parentName:"p",href:"https://docs.vllm.ai/en/latest/models/supported_models.html"},"here"),".\nAfter satisfying the requirements, you can add an open-source LLM's huggingface repository to the config file,"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json,"},'// Add the LLM\'s huggingface repo to your config file and use EMPTY as the api_key.\n[\n    ...\n    {\n        "model": "meta-llama/Llama-2-13b-chat-hf",\n        "api_key": "EMPTY"\n    }\n]\n')),(0,i.kt)("p",null,"and specify it when initializing AgentBuilder.\nAgentBuilder will automatically set up an endpoint server for open-source LLM. Make sure you have sufficient GPUs resources."),(0,i.kt)("h2",{id:"future-workroadmap"},"Future work/Roadmap"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Let the builder select the best agents from a given library/database to solve the task.")),(0,i.kt)("h2",{id:"summary"},"Summary"),(0,i.kt)("p",null,"We propose AutoBuild with a new class ",(0,i.kt)("inlineCode",{parentName:"p"},"AgentBuilder"),".\nAutoBuild can help user solve their complex task with an automatically built multi-agent system.\nAutoBuild supports open-source LLMs and GPTs API, giving users more flexibility to choose their favorite models.\nMore advanced features are coming soon."))}c.isMDXComponent=!0},7665:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/agent_autobuild-e48543a81e85bb185c7365db1290a91a.png"}}]);