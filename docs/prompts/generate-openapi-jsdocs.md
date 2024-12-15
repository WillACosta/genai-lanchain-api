Generate the JSDocs comments using OpenAPI for the following API specs:

```yaml
endpoint name: /users/change-role/{id}
path parameter type: string
method: Delete
tags: [Users]
request body: {
  "role": ["admin", "user"]
}
summary: Update a user role and return it, this route is used only by admins
200_response: {
	"success": true,
	"data": [
    {
      "id": "367b2539-bef4-412b-b94d-c9d2178dcdaa",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "createdAt": "2024-09-30T21:04:18.656Z",
      "role": "user"
    }
  ]
}
400_response: {
  "success": false,
  "error": {
    "message": [
      "Role is required.",
    ]
  }
}
headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

More context: I'm using `swagger-ui-express` and `swagger-jsdoc` libraries to setup the Swagger documentation.
Give me only the response, without explanations.
