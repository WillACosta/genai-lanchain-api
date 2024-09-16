import 'dotenv/config'

import { Document } from '@langchain/core/documents'
import { RunnableSequence } from '@langchain/core/runnables'
import {
	initializeVectorstoreWithDocuments,
	loadAndSplitChunks,
} from './lib/helpers.ts'

///////////// DOC RETRIEVAL CHAIN /////////////////////

// Load and split document in chunks
const docChunks = await loadAndSplitChunks({
	chunkSize: 1536,
	chunkOverlap: 128,
})

// create a new Vector Store in memory and add the docs to it
const vectorstore = await initializeVectorstoreWithDocuments({
	documents: docChunks,
})

// create a new retriever
const retriever = vectorstore.asRetriever()

const convertDocsToString = (documents: Document[]): string => {
	return documents
		.map((document) => {
			return `<doc>\n${document.pageContent}\n</doc>`
		})
		.join('\n')
}

// Chain for processing the docs
const documentRetrievalChain = RunnableSequence.from([
	(input) => input.question,
	retriever,
	convertDocsToString,
])

///////////// RETRIEVAL CHAIN /////////////////////

const TEMPLATE_STRING = `You are an experienced researcher,
expert at interpreting and answering questions based on provided sources.
Using the provided context, answer the user's question
to the best of your ability using only the resources provided.
Be verbose!

<context>
  {context}
</context>

Now, answer this question using the above context:
{question}`

const answerGenerationPrompt = ChatPromptTemplate.fromTemplate(TEMPLATE_STRING)
const model = new ChatOpenAI({
	modelName: 'gpt-3.5-turbo-1106',
})

/// Call LLM with the prompt and Vector DB results
const retrievalChain = RunnableSequence.from([
	{
		context: documentRetrievalChain,
		question: (input) => input.question,
	},
	answerGenerationPrompt,
	model,
	new StringOutputParser(),
])

///////////// ADDING HISTORY /////////////////////

// VERBOSE WAY

const REPHRASE_QUESTION_SYSTEM_TEMPLATE = `Given the following conversation and a follow up question,
rephrase the follow up question to be a standalone question.`

const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
	['system', REPHRASE_QUESTION_SYSTEM_TEMPLATE],
	new MessagesPlaceholder('history'),
	[
		'human',
		'Rephrase the following question as a standalone question:\n{question}',
	],
])

const rephraseQuestionChain = RunnableSequence.from([
	rephraseQuestionChainPrompt,
	new ChatOpenAI({ temperature: 0.1, modelName: 'gpt-3.5-turbo-1106' }),
	new StringOutputParser(),
])

const originalQuestion = 'What are the prerequisites for this course?'

const originalAnswer = await retrievalChain.invoke({
	question: originalQuestion,
})

const chatHistory = [
	new HumanMessage(originalQuestion),
	new AIMessage(originalAnswer),
]

await rephraseQuestionChain.invoke({
	question: 'Can you list them in bullet point form?',
	history: chatHistory,
})

// Creating a new prompt for instruct better the LLM with the history
const ANSWER_CHAIN_SYSTEM_TEMPLATE = `You are an experienced researcher,
expert at interpreting and answering questions based on provided sources.
Using the below provided context and chat history,
answer the user's question to the best of
your ability
using only the resources provided. Be verbose!

<context>
{context}
</context>`

const answerGenerationChainPrompt = ChatPromptTemplate.fromMessages([
	['system', ANSWER_CHAIN_SYSTEM_TEMPLATE],
	new MessagesPlaceholder('history'),
	[
		'human',
		'Now, answer this question using the previous context and chat history:\n{standalone_question}',
	],
])

await answerGenerationChainPrompt.formatMessages({
	context: 'fake retrieved content',
	standalone_question: 'Why is the sky blue?',
	history: [
		new HumanMessage('How are you?'),
		new AIMessage('Fine, thank you!'),
	],
})

/////////// RunnablePassThrough /////////////

import { RunnablePassthrough } from '@langchain/core/runnables'

/// Use this method to pass past contexto to new chains
// like we do above
const conversationalRetrievalChain = RunnableSequence.from([
	RunnablePassthrough.assign({
		standalone_question: rephraseQuestionChain,
	}),
	RunnablePassthrough.assign({
		context: documentRetrievalChain,
	}),
	answerGenerationChainPrompt,
	new ChatOpenAI({ modelName: 'gpt-3.5-turbo' }),
	new StringOutputParser(),
])

/////////// RunnableWithMessageHistory /////////////

const messageHistory = new ChatMessageHistory()

// Update and keeps history in memory based on the informed key
const finalRetrievalChain = new RunnableWithMessageHistory({
	runnable: conversationalRetrievalChain,
	getMessageHistory: (_sessionId) => messageHistory,
	historyMessagesKey: 'history',
	inputMessagesKey: 'question',
})

const originalAnswer2 = await finalRetrievalChain.invoke(
	{
		question: 'What are the prerequisites for this course?',
	},
	{
		configurable: { sessionId: 'test' },
	},
)

const finalResult = await finalRetrievalChain.invoke(
	{
		question: 'Can you list them in bullet point form?',
	},
	{
		configurable: { sessionId: 'test' },
	},
)

console.log(finalResult)
