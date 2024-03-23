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

//In case of "save"
//If you use arrow function, you won't get access to this.
//Use normal function if you want to make changes to the data before saving.
customerSchema.pre("save" , function (next) {
    //You can access object about to be saved using this keyword.
    console.log("Pre-Hool : save : ",this.name);
    next() //call next as it's a middleware.
})


customerSchema.pre("findOneAndDelete" , function (next) {
    //You can access using this keyword.
    //console.log(this.name);//it's NOT the object which is about to be deleted.
    console.log( "PRE-HOOK  " , this.getQuery());//it's the objectId which is about to be deleted.
    next() //call next as it's a middleware.
})

//When you delete a customer, you want to delete all the corresponding 'orders'.
//'orders' contain ObjectId of of docuemtns of 'orders' collection.
customerSchema.post("findOneAndDelete" , async(customer)=>{
    console.log("POST deleting document")
    
    const all_orders = customer.orders.length;//customer.orders  is an array.
    if(all_orders){
        const res = await Order.deleteMany({_id : {$in : customer.orders}})
        //we're all the ObjectId's in customer.orders array will get deleted.
        console.log(res);
    }
    //You don't have next() here as it's post operation
})


//Create model for both schema
const Order = mongoose.model('Order' , orderSchema)
const Customer = mongoose.model('Customer' , customerSchema)

const addCustomer = async ()=>{
    console.log("adding customers");
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
    console.log(result?result : "no customer");
}

const deleteCustomer = async()=>{

    //There's only one user in the database
    //Take out it's id.
    const customer = await Customer.findOne({})
    // console.log(id);
    if(!customer){
        console.log("DATABASE EMPTY");
    }
    else{


        const id = customer._id;
        await Customer.findByIdAndDelete(id)
        console.log("DELETED");
    }
    
}

//Run it only once, used to initialise orders collection.
const addOrders = async ()=>{
    await Order.deleteMany({})
    console.log("Adding orders");
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
addOrders() //Run once
// addCustomer()
// getCostumer()
//deleteCustomer() //make sure atleast one customer is there in DB when you call delete

setTimeout(addCustomer , 2000)
setTimeout(deleteCustomer , 4000)

