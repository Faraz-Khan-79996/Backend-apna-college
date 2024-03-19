const express = require('express')
const ExpressError = require('./expressError')
//This is our custom error class 

const app = express()

const checkToken = (req , res , next)=>{
    let {token} = req.query;

    if(token === "giveaccess"){
        next();
    }
    throw new ExpressError(401 , "ACCESS DENIED : token should be giveaccess")
}

app.get('/' , checkToken ,async(req , res)=>{
    res.send('Your token was : <strong>giveaccess</strong> <br> which is correct!')
})


app.get('/error' , (req , res)=>{
    a = rtytk//creating an error
    //error which is thrown is not custom but by javascript
    //it does not contain 'status'
    //it DOES contain message
    res.send('hello world')
})


//any error which is thrown will be handled by these middlewares.
app.use((err , req , res , next)=>{
    console.log("---------------------------ERROR ---------------------------");
    next(err)
    //next() without parameter will search for next NON error handling middleware or normal middlware.
    //next(err) will search for next error handling middleware.
})

app.use((err , req , res , next)=>{
    console.log('------------------------- Error2 -------------------------');
    next(err)
    //If there're no next error handling middleware, default error handler of express will execute.
})

app.use((err , req , res , next) =>{
    const {status=500 , message } = err;
    //Taking out status and message from 'err' object which was thrown.
    //In case of '/error' route, default error will get thrown by by node, 
    //which does not have a 'status', therefore 'status' is 'undefined'.

    //if 'status' is undefined therefor error will occur as express does not 
    //undefinded inside res.status() method.
    res.status(status).send(message)
})

app.listen(3000)

//You can also do this in case of async
try {
    // some code
    //errors thrown by third party library functions
} catch (error) {
    next(error)
    //calling our handler.
    //If no handler, express default handler executes
}