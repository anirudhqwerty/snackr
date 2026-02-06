```
User types email + password
↓
handleLogin()
↓
apiRequest("/auth/login", "POST", { email, password })
↓
Server checks credentials
↓
Server sends JWT
↓
saveToken(JWT)
↓
JWT stored in AsyncStorage
↓
router.replace("/")
↓
User enters app
```

App calls /auth/me
Backend returns { role: "customer" | "vendor" | "delivery" }
```
App automatically routes user to:
customer area
vendor area
delivery area
User cannot access other roles’ screens
```