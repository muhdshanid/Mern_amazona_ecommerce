import express from 'express'
import data from './data.js'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import seedRouter from './routes/seedRoutes.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import orderRouter from './routes/orderRoutes.js'
 

dotenv.config()

const DB_PASS = process.env.DB_PASSWORD

const URI = `mongodb+srv://admin:${DB_PASS}@cluster0.xpt6zfk.mongodb.net/amazona?retryWrites=true&w=majority`

const LOCAL_URI = process.env.LOCAL_MDB

mongoose.connect(LOCAL_URI).then(()=> {
    console.log("Connected to db ");
}).catch((err)=>{
    console.log(err.message);
})  

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get("/api/keys/paypal",(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

app.use("/api/seed",seedRouter)
app.use("/api/products",productRouter)
app.use("/api/users",userRouter)
app.use("/api/orders",orderRouter)



app.use((err,req,res,next)=>{
    res.status(500).send({message:err.message})
})


const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})