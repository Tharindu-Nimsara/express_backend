import Product from "../models/products.js";
import { isAdmin } from "./userControllers.js";

export async function getProducts(req, res) {
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

  try {
    if (isAdmin(req)) {
      const products = await Product.find();
      res.json(products);
    } else {
      const products = await Product.find({ isAvailable: true });
      res.json(products);
    }
  } catch (err) {
    res.json({
      message: "Failed to get products",
      error: err,
    });
  }
}

export function saveProducts(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "Unauthorized You need to be an Admin",
    });
    return;
  }

  console.log("📥 Received product data:", req.body); // ✅ Debug log

  // ✅ Validation
  const { productId, name, description, labelledPrice, price, stock } =
    req.body;

  if (!productId || !name || !description) {
    res.status(400).json({
      message: "Product ID, name, and description are required",
    });
    return;
  }

  if (isNaN(labelledPrice) || isNaN(price) || isNaN(stock)) {
    res.status(400).json({
      message: "Labelled price, price, and stock must be valid numbers",
    });
    return;
  }

  const product1 = new Product(req.body);

  product1
    .save()
    .then((savedProduct) => {
      console.log("✅ Product saved successfully:", savedProduct); // ✅ Debug log
      res.status(201).json({
        message: "Product saved successfully",
        product: savedProduct,
      });
    })
    .catch((error) => {
      console.error("❌ Database save error:", error); // ✅ Debug log

      // Handle specific MongoDB errors
      if (error.code === 11000) {
        res.status(400).json({
          message: "Product ID already exists",
        });
      } else if (error.name === "ValidationError") {
        res.status(400).json({
          message: "Validation error: " + error.message,
        });
      } else {
        res.status(500).json({
          message: "Failed to save product: " + error.message,
        });
      }
    });
}

// export function saveProducts(req, res) {
//   // //checking valid user (see JWT)
//   // if(req.user == null){
//   //     res.status(403).json({
//   //         message:"Unauthorized"
//   //     })
//   //     return
//   // }

//   // if(req.user.role != "admin"){
//   //     res.status(403).json({
//   //         message: "Unauthorized You need to be an Admin"
//   //     })
//   //     return
//   // }

//   if (!isAdmin(req)) {
//     res.status(403).json({
//       message: "Unauthorized You need to be an Admin",
//     });
//     return; //exit from saveProducts function
//   }

//   const product1 = new Product(req.body);

//   product1
//     .save()
//     .then(() => {
//       res.json({
//         message: "Product saved successfully",
//       });
//     })
//     .catch(() => {
//       res.json({
//         message: "Failed to save product!",
//       });
//     });
// }

export async function deleteProduct(req, res) {
  //only an admin can delete a product
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to delete a product",
    });
    return;
  }

  try {
    await Product.deleteOne({ productId: req.params.productId });
    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete product",
      error: err,
    });
  }
}

export async function updateProduct(req, res) {
  if (!isAdmin(req)) {
    res.status(403).json({
      message: "You are not authorized to update a product",
    });
    return;
  }

  const productId = req.params.productId;
  const updatingData = req.body;

  try {
    await Product.updateOne({ productId: productId }, updatingData);
    res.json({
      message: "Product updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}

//get only one product
export async function getProductById(req, res) {
  const productId = req.params.productId;

  try {
    const product = await Product.findOne({ productId: productId });
    if (product == null) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }
    //isAvailable = checking stock
    if (product.isAvailable) {
      res.json(product);
    } else {
      //only admins can see "isAvailable = false"  products
      if (!isAdmin(req)) {
        res.status(404).json({
          message: "Product not found",
        });
        return;
      } else {
        res.json(product);
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
}
