# How AI works

Large language models do something conceptually simple: they predict the next token in a
sequence. The output can look like reasoning, explanation, or conversation, but the mechanism
starts with prediction.

Modern AI systems learn patterns from data instead of relying only on rules written by a
programmer. During training, a model adjusts its internal parameters as it processes a large
dataset. Validation checks its performance on data it has not seen. Deployment puts the trained
model to work on real tasks.

Neural networks do the pattern matching. They contain connected layers that transform an input
in stages. In an image system, early layers might detect edges. Deeper layers can combine those
signals into shapes, objects, and scenes. The name comes from a loose inspiration in biology,
although these systems resemble a brain only superficially.

Transformers added an attention mechanism. Attention lets a model weigh which parts of its input
are relevant while producing each part of its output. That helps it work with relationships
across longer stretches of text and maintain coherence across paragraphs.

Scale matters too. Larger models trained on more data can develop capabilities that smaller
systems did not display, including tasks they were not explicitly trained to perform. The source
draft does not explain when or why those capabilities emerge, so this rewrite should not pretend
to.

The limitations follow from the same setup. A model can produce false facts, repeat biases from
its training data, and consume substantial computing resources. Fluency does not guarantee
accuracy. When an answer matters, check its facts rather than treating confidence as evidence.
