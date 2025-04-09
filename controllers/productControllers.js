import Product from "../models/products.js";
import { isAdmin } from "./userControllers.js";


export async function getProducts(req,res){
    // Product.find().then(
    //     (data)=>{
    //     res.json(data)
    // }).catch(
    //     (err)=>{
    //         res.json({
    //             message: "Failed to get products",
    //             error: err
    //         })
    //     }
    // )

    // on behalf of above code we can use async await (using await inside async function)

    try{
        if(isAdmin(req)){
            const products = await Product.find()
            res.json(products)
        }else{
            const products = await Product.find({isAvailable : true})
            res.json(products)

        }
        
    }catch(err){
        res.json({
            message: "Failed to get products",
            error : err
        })
    }

}


export function saveProducts(req,res){
    // //checking valid user (see JWT)
    // if(req.user == null){
    //     res.status(403).json({
    //         message:"Unauthorized"
    //     })
    //     return
    // }

    // if(req.user.role != "admin"){
    //     res.status(403).json({
    //         message: "Unauthorized You need to be an Admin"
    //     })
    //     return
    // }

    if(!isAdmin(req)){
        res.status(403).json({
            message: "Unauthorized You need to be an Admin"
        })
        return  //exit from saveProducts function  
    }

    const product1 = new Product(
        req.body
    )

    product1.save().then(()=>{
        res.json({
            message:"Product saved successfully"
        })
    }).catch(()=>{
        res.json({
            message:"Failed to save product!"
        })
    })



}

export async function deleteProduct(req, res){
    //only an admin can delete a product
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to delete a product"
        })
        return
    }
    

    try{
        await Product.deleteOne({productId: req.params.productId})
        res.json({
            message: "Product deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            message: "Failed to delete product",
            error : err
        })
    }

}