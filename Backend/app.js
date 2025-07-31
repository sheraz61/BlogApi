import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import cors from 'cors'


const app = express()
app.use(cors({
    origin: 'http://localhost:5173', // Allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Authorization', 'X-Refresh-Token', 'Content-Type'], // Allowed headers
    credentials: true // Allow sending credentials (e.g., cookies)
  }));


// Configure middleware to parse JSON requests
app.use(express.json({
    limit: "16kb" // Limit JSON payload size to 16kb
}))

app.use(express.urlencoded({
    extended: true, // Allow parsing of nested objects
    limit: "16kb" // Limit URL-encoded payload size to 16kb
}))

// Parse cookies in incoming requests
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.send('Blog app runing at this port')
})
import userRoute from './routes/user.routes.js'
import adminRoute from './routes/admin.routes.js'
import postroute from './routes/post.routes.js'
app.use('/api/v1/user',userRoute)
app.use('/api/v1/admin',adminRoute)
app.use('/api/v1/post',postroute)
export {app}