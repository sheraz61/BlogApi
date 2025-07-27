import dotenv from 'dotenv'
import { app } from "./app.js"
import {connectDB} from './db/index.js'
dotenv.config({
    path:'.env'
})
connectDB().then(()=>{
    app.listen(process.env.PORT || 9000,()=>{
        console.log(`Server listening on ${process.env.PORT}`);
    })
}).catch((err)=>{
    console.log('MongoDB error:',err);
})