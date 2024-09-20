const config = {
	port: 3000,
	jwtSecret: '!!CryptoSecret@!!',
	jwtExpirationInSeconds: 60 * 60, // 1 hour
	roles: {
		USER: 'user',
		ADMIN: 'admin',
	},
}

export default config
