# LEARNINGS

When engaging in this project, the initial approach was using Gemini Code Assist in JetBrains. This was a interesting experience but essentially works the same as a regular chat bot with limited project context support. It is not a true code assistant in the way Cursor or Antigravity is. So during this experimental project the inital approach was limited and not as effective as I had hoped.

During the iterations of this project I've used the following AI tools:

* Gemini Code Assist
* Cursor
* Antigravity
* Claude

All to varying degrees of success. By far my most successful and consistent experience was using Antigravity. It was able to generate usable code more often than the other tools and was able to understand the context of the project better. But there were some severe limitations in terms of complexity of the code it could generate.

The largest pinch points I ran into were using AI text detection, inital models and approaches were very incosistent and would often fail to detect text properly. This meant I had to either 1, guide the agent on the exact approach to take or 2, use a different tool to detect the text. There were three distinct approaches I used to solve this problem:

1. Using Google Cloud Vision API
2. Using Gemini image detection
3. Generating a contract only image and then running the monochrome image through Gemini

When using option 2, I found the best results, however, this meant every single scan consumed a very large amount of Cloud Vision and Gemini credits. I eventually settled on using Gemini 2.5 Flash to do all the image detection and add more client side image detection to improve the experience.

___

## Breakdown and Feedback

### Gemini Code Assist

Very good at generating code, but not very good at understanding the context of the project. It is not a true code assistant in the way Cursor or Antigravity is. It can take a signle task at a time and resolve accross many files but requires extensive guidance to do so. It's quite valuable for writing documentation, or solving simple problems but not for complex tasks or project iterations.

### Cursor

Incredibly good at understanding the context and generating relevant code, quite slow but generally accurate and with the thinking/reasoning models is able to demonstrate a measured approach to solve small-mid sized problems. During the process I was only able to use it for a short period on the free plan as the tokens were limited but generally I had a positive experience with it.

### Claude
Overall I had a very limited experience with Claude because of the very limited free plan, but from my experience it was less effective than Gemini Code Assist and especially Cursor. Chatbot seems about as effective as Gemini Code Assist for questions or documentation but overall less effective for tasks or multiple file iterations.

### Antigravity
This was my most positive experience with AI code generation. It was able to generate useful code, was correct more often than not and was able to show a planned approach to solving the problem even when using the small flash models. 

Having the task -> implementation plan -> walkthough approach yielded a higher degree of trust and understanding, this was replicatable using Cursor or Claude but Antigravity was the most consistent in this regard.

___

Key take aways,
1. Ai tools are definitly not at the level or a mid-senior engineer, but they are rapidly improving and I would consider them a valuable productivity tool.
2. Brainstorming on a task list or implementation plan is a very effective way to get the most out of AI tools and even if the AI cannot execute the plan, it can still provide valuable insights and guidance.
3. LLM's are excelling at simple tasks and documentation but are still limited in their ability to understand context but for internal tooling or just tinker work are effective.
4. Researching with LLM's is a extremely good time saver when it comes to greenfield projects and can help iterate on ideas more quickly.


Thank you for coming to my Ted Talk.

___

### Future Experiments

1. Using more premium models for testing
2. Give Claude Premium a better try as the free tier I tried was borderline awful
3. Integrate more advanced models into PHPstorm and play with their features.