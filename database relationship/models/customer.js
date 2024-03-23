const mongoose = require('mongoose');


//Implementation of one to many.
//ObjectId is stored of the other document you want to access.

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('database connected');
}

const orderSchema = new mongoose.Schema({
    item : String,
    price : Number,

})

const customerSchema = new mongoose.Schema({
    name : String,
    orders : [
        {
            //Defining ObjectId as type
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Order'
            //orders collection
        }
    ]
})


//Create model for both schema
const Order = mongoose.model('Order' , orderSchema)
const Customer = mongoose.model('Customer' , customerSchema)

const addCustomer = async ()=>{

    //clear the collection for simplicity.
    await Customer.deleteMany({})

    let cust1 = new Customer({
        name : "faraz the great",
    });

    const order1 = await Order.findOne({item:"mobile"})
    const order2 = await Order.findOne({item:"laptop"})

    cust1.orders.push(order1)
    cust1.orders.push(order2)

    const res = await cust1.save()
    //When you save an print the result, whole sub-objects are printed in
    //the 'orders' property
    //But actually inside the database, only the ObjectId is stores in 'orders' property. 
    // console.log(res);

    const customer_collection = await Customer.findOne()
    console.log(customer_collection);
    //Inside the 'orders' property, ObjectId of 'order1','order2' is stored.
    //in the form of array
}

const getCostumer = async ()=>{
    const result = await Customer.findOne({}).populate('orders')
    //populates the 'orders' which is containing the ObjectId with the actual objects.
    //basically finds the document with the stored ObjectId and and attaches it at the place.
    console.log(result);
}

//Run it only once, used to initialise orders collection.
const addOrders = async ()=>{
    const res = await Order.insertMany([
        {
            item : "laptop",
            price : 40000,
        },
        {
            item : "mobile",
            price : 10000,
        },
        {
            item : "car",
            price : 4000000,
        },
    ])

    console.log(res);
}
// addOrders() //Run once
// addCustomer()
getCostumer()