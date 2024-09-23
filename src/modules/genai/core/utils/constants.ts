export const SEARCH_DOC_SYSTEM_PROMPT = `You are an experienced researcher, expert at interpreting and answering questions based on provided sources. Using the provided context, answer the user's question to the best of your ability using only the resources provided. Be verbose!

<context>
{context}
</context>

Now, answer this question using the above context:

{question}`

export const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.`
