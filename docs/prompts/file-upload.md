With this code:

```
const express = require('express');
const app = express();

app.post('/submit-form', (req, res) => {
    let body = '';

    // Collect the data chunks
    req.on('data', chunk => {
        body += chunk.toString();
    });

    // When all data is received
    req.on('end', () => {
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const parts = body.split(`--${boundary}`);

        // Extract form data
        const formData = {};
        parts.forEach(part => {
            if (part.includes('Content-Disposition')) {
                const nameMatch = part.match(/name="([^"]+)"/);
                const valueMatch = part.split('\r\n\r\n')[1];
                if (nameMatch && valueMatch) {
                    const name = nameMatch[1];
                    const value = valueMatch.trim();
                    formData[name] = value;
                }
            }
        });

        // Send the form data back as a JSON response
        res.json(formData);
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

I want to send a form data with `document: file, query: text`, how can I handle this, when I receive the request I want to write the uploaded document in a PDF and store using `fs` library, and I want to use the text from `query` field to be stored in a `const` for late usage.

---

## Responses:

- Using `multer`

```js
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

app.post('/upload-endpoint', upload.single('file'), (req, res) => {
	const query = req.body.query
	const filePath = req.file.path

	res.json({
		message: 'File and query received successfully!',
		data: {
			query: query,
			filePath: `/uploads/${req.file.filename}`,
		},
	})
})
```
