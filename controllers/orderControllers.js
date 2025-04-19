import Order from "../models/order.js";
import Product from "../models/products.js";

export async function createOrder(req, res) {
  //get user info
  if (req.user == null) {
    res.status(403).json({
      message: "Please login and try again",
    });
    return;
  }

  const orderInfo = req.body;

  //add current users name if not provided
  if (orderInfo.name == null) {
    orderInfo.name = req.user.firstName + " " + req.user.lastName;
  }

  //CBC00001  (Make a suitabel order Id for the business)
  let orderId = "CBC00001";

  //getting last orderId
  //date: -1  means getting the latest order (a order list). limit to one order
  //if we put date:1  it gives first order
  const lastOrder = await Order.find().sort({ date: -1 }).limit(1);

  //now lastOrder is a array with one element

  if (lastOrder.length > 0) {
    const lastOrderId = lastOrder[0].orderId;
    //now lastOrderId is like CBC00551

    const lastOrderNumberString = lastOrderId.replace("CBC", "");
    //now lastOrderNumberString is like 00551

    const lastOrderNumber = parseInt(lastOrderNumberString); //551

    //new orderId generate
    const newOrderNumber = lastOrderNumber + 1; //552

    const newOrderNumberString = String(newOrderNumber).padStart(5, "0"); // 00552

    orderId = "CBC" + newOrderNumberString; // "CBC00552"
  }

  try {
    let total = 0;
    let labelledTotal = 0;
    const products = []; //to make a product arra with info

    //validating products
    for (let i = 0; i < orderInfo.products.length; i++) {
      const item = await Product.findOne({
        productId: orderInfo.products[i].productId,
      });
      if (item == null) {
        res.status(404).json({
          message:
            " Product with product ID " +
            orderInfo.products[i].productId +
            " not found",
        });
        return;
      }

      //checking isAvailable true
      if (item.isAvailable == false) {
        res.status(404).json({
          message:
            "Product with productId " +
            orderInfo.products[i].productId +
            " is not available right now.",
        });
        return;
      }
      products[i] = {
        productInfo: {
          productId: item.productId,
          name: item.name,
          altNames: item.altNames,
          description: item.description,
          images: item.images,
          labelledPrice: item.labelledPrice,
          price: item.price,
        },
        quantity: orderInfo.products[i].qty
      };

      total += item.price * orderInfo.products[i].qty;

      labelledTotal += item.labelledPrice * orderInfo.products[i].qty;
    }

    //create order
    const order = new Order({
      orderId: orderId,
      email: req.user.email,
      name: orderInfo.name,
      address: orderInfo.address,
      phone: orderInfo.phone,
      products: products,
      total: total,
      labelledTotal: labelledTotal,
    });

    const createdOrder = await order.save();
    res.json({
      message: "Order created successfully",
      order: createdOrder,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create order",
      error: err,
    });
  }
}
