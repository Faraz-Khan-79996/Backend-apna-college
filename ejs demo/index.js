const express = require('express')
const path = require('path')
const data = require('./data.json')
const app = express()

const port = 3000


//simple demo
//localhost:3000/search/cats

app.set("view engine" , "ejs");
app.set('views' , path.join(__dirname , "/views"))
//setting the absolute path of views.
//no matter from where you start the server, path of views will be WRT to index.js
//name must be views, ejs automatically searches inside views folder.

//We're making 2 static folders which are inside public.
//We can directly reference the static folders from our ejs files.
//we can provide the path from ejs files which are in views from the static folders onwards.
app.use(express.static(path.join(__dirname , "public/css")))
app.use(express.static(path.join(__dirname , "public/javascript")))


app.get('/search/:username' , (req , res)=>{

    let {username} = req.params;
    const user = data[username]
    // user is an object with lots of properties
    if(user){
        res.render("insta_view/insta.ejs" , {user})
        //insta_view/insta.ejs  will automatically get search in view folders.
    }
    else{
        res.render('error.ejs')
        //seraches in views folder on it's own
    }
})


app.listen(port , ()=>{
    console.log("server started");
}) 