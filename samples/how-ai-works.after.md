# How AI works

A language model does one thing. It takes a stretch of text and produces a probability for every token that could come next, and something samples from that distribution. Then it does it again with the new token appended. Everything else you have heard about these systems is either a consequence of that loop or a story people tell about it.

A token is not a word. Most models chop text into subword fragments, so "strawberry" arrives as three or four pieces and never as ten letters. This is why a model that can write a working sort function will confidently miscount the r's in it. The letters were never there to count.

The architecture doing the predicting is the transformer, from a 2017 paper by Vaswani and seven co-authors, most of them at Google, titled "Attention Is All You Need". Its useful idea is attention: when the model computes the representation of one token, it takes a weighted blend of every other token in the context, and it learns the weights. A pronoun late in a paragraph can pull most of its meaning from a noun four hundred words earlier, because the model learned that pulling from there pays off.

Training happens in two phases that get conflated. Pretraining runs the prediction loop over an enormous pile of text and adjusts billions of parameters to make the observed continuation more likely. That gives you something that knows how text tends to go. It also gives you something with no sense of when to stop or what a helpful reply looks like. Post-training fixes that, mostly by having humans rank candidate responses and tuning the model toward the winners.

That two-phase structure explains the failure everyone complains about. Nothing in either phase optimises for truth. Pretraining rewards plausible continuations. Post-training rewards responses people rate highly, and people rate confident answers highly. A fabricated citation with a real-sounding author and a plausible year is exactly what both objectives ask for. Calling it a hallucination makes it sound like a malfunction. It is the system working.

Scale is doing more of the work than most explanations admit. The transformer paper is nine years old and the core mechanism has barely changed. What changed is parameter count, data volume, training compute, the length of context the model can attend over, and a great deal of unglamorous engineering. Capabilities that nobody designed in appear somewhere along that curve, which is genuinely strange and not well understood.

The mental model to avoid is the one where the model understands your question and then answers it. The model continues your text. Usually the most probable continuation of a well-posed question is a correct answer, which is why this works at all. When it isn't, you get something fluent and wrong, delivered in the same voice as everything else.

That is the practical reason to learn the mechanism. It tells you where to check: the citation, the arithmetic, the letter count.
