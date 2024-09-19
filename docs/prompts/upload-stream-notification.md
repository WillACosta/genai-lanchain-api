I have this code in `node` and `express`, it's an endpoint to upload a FormData with `file` and `query` fields.

```js
...
async searchInDocument(req, res) {
		let body = ''
		let totalBytes = parseInt(req.headers['content-length'], 10)
		let receivedBytes = 0
		const generatedFileName = `user-file-${crypto.randomUUID()}.pdf`

		req.on('data', (chunk) => {
			body += chunk.toString()

			receivedBytes += chunk.length
			const percentComplete = ((receivedBytes / totalBytes) * 100).toFixed(2)
			console.log(`Upload progress: ${percentComplete}%`)
		})

		req.on('end', () => {
			const boundary = req.headers['content-type'].split('boundary=')[1]
			const parts = body.split(`--${boundary}`)

			const formData = {}
			let fileBuffer = null

			parts.forEach((part) => {
				if (part.includes('Content-Disposition')) {
					const nameMatch = part.match(/name="([^"]+)"/)
					const fileNameMatch = part.match(/filename="([^"]+)"/)
					const valueMatch = part.split('\r\n\r\n')[1]

					if (nameMatch && valueMatch) {
						const name = nameMatch[1]

						if (fileNameMatch) {
							const fileContent = valueMatch.split('\r\n')[0]
							fileBuffer = Buffer.from(fileContent, 'binary')
						} else {
							const value = valueMatch.trim()
							formData[name] = value
						}
					}
				}
			})

			if (fileBuffer) {
				const currentDir = process.cwd()
				const filePath = path.join(currentDir, 'uploads', generatedFileName)
				fs.writeFileSync(filePath, fileBuffer, 'binary')
			}

			const query = formData['query']

			res.json({
				message: 'File and query received successfully!',
				data: {
					query: query,
					filePath: `/uploads/${generatedFileName}`,
				},
			})
		})
	}
```

I want to provide a way to update the user about the uploading status, is there possible to do this in the API? I was thinking if I can expose a Stream for this endpoint and let the user listen to the results and get the percentage value update at "real time", what is the best approach?

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>File Upload with Progress</title>
	</head>
	<body>
		<h1>File Upload Progress</h1>
		<progress id="progressBar" value="0" max="100"></progress>
		<p id="status"></p>
		<script>
			const eventSource = new EventSource('/upload-endpoint') // Replace with your actual endpoint
			eventSource.onmessage = function (event) {
				const data = event.data // If the data is a number, it's the progress percentage
				if (!isNaN(data)) {
					document.getElementById('progressBar').value = data
				} else {
					// Otherwise, it's the final response
					const response = JSON.parse(data)
					document.getElementById('status').innerText = response.message
				}
			}
		</script>
	</body>
</html>
```
