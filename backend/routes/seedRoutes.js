import express from 'express'
import data from '../data.js'
import Product from '../model/ProductModel.js'
import User from '../model/UserModel.js'

const seedRouter = express.Router()

seedRouter.get("/",async(req,res)=>{
    await Product.remove({})
    const createdProducts = await Product.insertMany(data.products)
    await User.remove({})
    const createdUsers = await User.insertMany(data.users)
    res.send({createdUsers,createdProducts})
})


export default seedRouter