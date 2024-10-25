Generate the JSDocs comments using OpenAPI for the following API specs:

```yaml
endpoint name: /users/all
# path parameter type: string
method: GET
request body: {
  "name": "John Doe",
	"email": "john.doe@email.com",
}
summary: Returns all users
200_response: {
	"success": true,
	"data": [
    {
      "id": "367b2539-bef4-412b-b94d-c9d2178dcdaa",
      "name": "John Doe",
      "email": "john.doe@gmail.com",
      "createdAt": "2024-09-30T21:04:18.656Z"
    }
  ]
}
# 400_response: {
#   "success": false,
#   "error": {
#     "message": [
#       "Invalid email address",
# 			"name field is required"
#     ]
#   }
# }
headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <token>"
}
```

More context: I'm using `swagger-ui-express` and `swagger-jsdoc` libraries to setup the Swagger documentation.
Give me only the response, without explanations.
