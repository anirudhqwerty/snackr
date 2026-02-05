# AUTH
## FRONTEND
- user will add their email and password in expo frontend and then expo app will send request to nginx , nginx will send request to backend( auth service )
- the auth service will register or validate credentials incase of login and then send response back to nginx 
- the backend and frontend will never talk to each other directly
- created custom tabs inside the app folder and made basic login and register screens , now moving to backend
## BACKEND
- auth service will have 3 main responsibilites (Validate credentials ,Generate JWT , Return identity info)
#### JWT
- it is a stateless way to keep the user logged in , so that they dont have to log in after every action
- now how it manages session is that inside JWT is an "exp" ,when it expires the user has to log in again
- log out will just remove the token from the storage and then refresh the UI
#### node.js( express )
- js runs only in the browser so node.js helps us run js in our computer
- express is a framework built on top of node.js

- added a basic health endpoint tp express server to check its working

``` 
┌──────────────┐
│   frontend   │ 
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    nginx     │  
└──────┬───────┘
       │
       ▼
┌──────────────┐        ┌──────────────┐
│ auth-service │ ─────▶ │  postgres    │
└──────────────┘        └──────────────┘
```

#### nginx
```
       Expo
        |
        v
     NGINX :80
        |
        v
  auth-service :5000
        |
        v
     postgres
```

