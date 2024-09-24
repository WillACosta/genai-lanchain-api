export const SEARCH_DOC_SYSTEM_PROMPT = `You are an assistant for question-answering tasks.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, just say that you don't know. Be verbose!

<context>
{context}
</context>`

export const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `
Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.`
