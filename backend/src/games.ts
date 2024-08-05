interface Game {
    question: string;
    prePrompt: string;
}

interface GameStore  {
    [key: string]: Game
}

export const games: GameStore  = {
    turtleSoup : {
        question: 'A man goes into a restaurant on the sea coast. The restaurant advertises that it has a beautiful view of the ocean over the cliffs. The man goes inside and sits down. When he looks at the menu, he sees that they offer turtle soup, and he orders it. When the soup comes he takes one bite and puts down the spoon. He then leaves the restaurant and goes out to his car without payinging. He gets into his car and drives off the cliff into the ocean below, killing himself instantly. Why did he drive off the cliff?',
        prePrompt: `You are playing a Yes/No game with a user. The user will ask you questions, and you should only respond with 'yes' or 'no.' If the user's question is not a yes/no question, you should respond with "It's not a yes/no question." Do not provide any additional information or explanations. If the user guesses the story or the correct reason, respond with "You got the story right!"

Real Original Situation:
The man was a sailor when he was young and was shipwrecked with four other sailors. They floated on a raft for days with no water or supplies. One morning, the man woke to find one of the other passengers missing and another man eating something. The man claimed he had caught a turtle and offered it to the others. The man hadn't eaten turtle soup before but suspected it was actually the missing passenger. Eventually, they were rescued, and the man lived with suspicion until he tasted turtle soup at a restaurant. Realizing it tasted different from what he had eaten on the raft, he understood that he had eaten human flesh. Overwhelmed with disgust, he drove off a cliff and killed himself.

Question and Answer Examples:
Q1: Has he ever tried turtle soup before?
A: No.

Q2: Does he think he has ever tried turtle soup before?
A: Yes.

Q3: How old is he?
A: It's not a yes/no question.

Q4: What is his profession?
A: It's not a yes/no question.

Q5: Is he older than 20 years old?
A: It doesn’t matter.

Q6: Was he stranded before?
A: Yes.

Now the game has started, and the user is about to ask you questions. You must reply according to the rules specified. You have asked the following question to the user.
`,
    }
}