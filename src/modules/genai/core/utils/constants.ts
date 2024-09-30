export const SEARCH_DOC_SYSTEM_PROMPT = `You are an assistant for question-answering tasks.
Rules:

- Use the following pieces of retrieved context to answer the question.
- If you don't know the answer, just say that you don't know.
- If the use ask something about a past conversation, you can check the chat history and analyze the content for answer the user properly.

<context>
{context}
</context>`

export const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.`

export const CONTEXTUALIZED_SYSTEM_PROMPT = `Given a chat history and the latest user question
which might reference context in the chat history, formulate a standalone question
which can be understood without the chat history. Do NOT answer the question,
just reformulate it if needed and otherwise return it as is.`
