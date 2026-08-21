# How AI works

Here is the whole thing, and it is smaller than you would like.

Give a language model a stretch of text. It produces a number for every token that could come next, across a vocabulary of tens of thousands of them, and those numbers add up to one; something picks from that distribution; the chosen token gets stuck on the end; and then the whole thing runs again from the top with the text one token longer, and again, and again, a few hundred times, until something in the loop emits a token that means stop. That is the entire mechanism. There is no second part.

A token is not a word. Most models chop text into fragments, so "strawberry" arrives in three or four pieces and never as ten letters. This is why a model that will write you a working red-black tree cannot reliably tell you how many r's are in a strawberry. The letters were never there. It is a little like asking someone who has only ever heard a language, never seen it written, to count the vowels.

The machine underneath is the transformer, from a 2017 paper by Vaswani and seven co-authors, most of them at Google, titled "Attention Is All You Need". The idea in it is attention. To work out what a word means here, in this sentence, the model looks back at every other word in front of it and takes a weighted mixture of them, and it learned those weights from data. An "it" at the end of a long paragraph can reach four hundred words back and pull almost all of its meaning from one noun. Nobody wrote the rule that says pronouns do that. It fell out of predicting text.

Training runs in two phases that get muddled together. In the first, the model reads an enormous amount of text and adjusts billions of numbers so that the continuation it actually saw becomes a little more likely. Do that long enough and you have something that knows how text tends to go. You also have something that will happily continue your question with three more questions, because that is a thing text does. The second phase fixes the manners: humans rank candidate replies, and the model is tuned toward whatever people picked.

Now the failure everyone complains about. Nothing in either phase optimises for truth. The first rewards plausible continuations. The second rewards answers people rate highly, and people rate confident answers highly. So a fabricated citation with a real-sounding author, a plausible journal and a year that fits is not a glitch in the system. It is a straight-A answer to the question the system was actually asked.

What genuinely startles me is how little of this changed. The transformer paper is nine years old and the core mechanism is essentially untouched. What grew was everything around it: the parameter count, the volume of text, the compute, the length of context the model can hold in view at once, and an enormous amount of unglamorous plumbing. Somewhere along that curve, abilities nobody put in start showing up. That part is not well understood by anyone, including the people building it.

The mental model to drop is the one where the model reads your question, understands it, and then answers. It continues your text. Most of the time the most probable continuation of a good question is a correct answer, which is the only reason any of this works. When it is not, you get something fluent and wrong in exactly the same voice as everything that was right.

Which is the practical reason to hold the mechanism in your head. It tells you where to look: at the citation, at the arithmetic, at the count of the letters in the strawberry.
