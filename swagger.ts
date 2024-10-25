import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Gen AI API',
		version: '1.0.0',
		description:
			'This is an Express service that provides authorization functionality and includes gen-AI features using RAG, Redis, Postgres, and Langchain.',
	},
	servers: [
		{
			url: 'http:localhost:3000',
		},
	],
	tags: [
		{
			name: 'Auth',
			description: 'Endpoints related to authentication',
		},
		{
			name: 'Users',
			description: 'Endpoints related to users management',
		},
		{
			name: 'AI',
			description: 'Endpoints related to gen-AI features',
		},
	],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
		},
	},
}

const options = {
	swaggerDefinition,
	apis: ['./src/modules/**/application/routes/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

export default swaggerSpec
