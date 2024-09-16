import 'dotenv/config'

import { OpenAIEmbeddings } from '@langchain/openai'
import { similarity } from 'ml-distance'

/// Create an Embedding for this query
const embeddings = new OpenAIEmbeddings()
await embeddings.embedQuery('Say hello in Japanese!')
/// Result will be an array of integer (vector)

/// Calculating the score for a given embedded query
/// Defining the queries
const vector1 = await embeddings.embedQuery(
	'What are vectors useful for in machine learning?',
)

const unrelatedVector = await embeddings.embedQuery(
	'A group of parrots is called a pandemonium.',
)

similarity.cosine(vector1, unrelatedVector)

/// Similarity: 0.6957264527346025

const similarVector = await embeddings.embedQuery(
	'Vectors are representations of information.',
)

similarity.cosine(vector1, similarVector)

/// Similarity: 0.8588144744020122

////////////////////////////////////////////////

// Read and search similar chunks from a PDF document
// 1. Load the PDF document
// 2. Split content into small chunks
// 3. Add it to the Vector Store in Memory
// 4. Search for similar chunks based on a NL query
// 5. Return all the page content

import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const loader = new PDFLoader('./data/MachineLearning-Lecture01.pdf')

const rawCS229Docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 128,
	chunkOverlap: 0,
})

const splitDocs = await splitter.splitDocuments(rawCS229Docs)

const vectorstore = new MemoryVectorStore(embeddings)
await vectorstore.addDocuments(splitDocs)

const retrievedDocs = await vectorstore.similaritySearch(
	'What is deep learning?',
	4,
)

const pageContents = retrievedDocs.map((doc) => doc.pageContent)
pageContents

/// Retrievers

const retriever = vectorstore.asRetriever()
await retriever.invoke('What is deep learning?')
