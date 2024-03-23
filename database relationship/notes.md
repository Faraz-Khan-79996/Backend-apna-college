## One to few

```apache
const userSchema = mongoose.Schema({
    username : String,
    addresses :[
        {
            _id : false,//Using false won't create object id for each individual object of an array
            //as the sub-object is being considered as another schema.
            location : String,
            city : String,
        },
    ],
});

const User = mongoose.model('User' , userSchema)
module.exports = User
```

adresses is an array of objects where each object has some properties. The subobjects will get treated as another shcema and ObjectId will get generated for them as well if you don't use `_id:false`

![1711187370846](image/notes/1711187370846.png)

## One to many

Store the reference of child document inside parent.

in schema, use `type : mongoose.Schema.Types.ObjectId` and `ref : 'name of collection in singular form'` like `ref :'Order'`

At the time of creation and saving the object to a collection, add the whole object at the place of 'ref'. The object will get replaced by it's ObjectId in the database.

At the time of fetching data, use `populate` to populate the document with the document whole Id is stored.

```apache
    let cust1 = new Customer({
        name : "faraz the great",
    });

    const order1 = await Order.findOne({item:"mobile"})
    const order2 = await Order.findOne({item:"laptop"})

    cust1.orders.push(order1)
    cust1.orders.push(order2)

    const res = await cust1.save()
```

```apache
const result=await Customer.findOne({}).populate('orders')
//Populates the orders field with the actual documents based on the id stored in orders field.
```

## One to Squillions

opposit of the above approach. We will store the reference to the parent inside of the child.


## Handling deletion using mongoose middleware

In out example customer.js , we're creating a user having some orders. User and Order are two models. When user is deleted, we want all the order deleted as well.

We use mongoose 'pre' 'post' middlewares which executers before and after query is executed.

In case of pre "save", you can access the object and modify it using `this`. In case of pre "findOneAndDelete" , this is the query object. You have to call `next()` in pre middlware. It's always a good idea.

in Post hook or middlware, function parameter is the document which we are working. No `next()` in post hook.


```apache
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
    console.log( "PRE-HOOK  " , this.getQuery());//this is a query object, getQure()it's the objectId which is about to be deleted.
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

```
