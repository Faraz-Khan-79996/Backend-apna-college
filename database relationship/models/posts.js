const mongoose = require('mongoose');

//One to squillions implementation.
//child document will have the reference of parent.

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('database connected');
}

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
})

const postSchema = new mongoose.Schema({
    content : String,
    likes : Number,
    //user will contain the ObjectId of the document of 'users' collection.
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

//Create model
const User = mongoose.model("User" , userSchema)
const Post = mongoose.model("Post" , postSchema)

//Run it once to add user to DB
const addUser = async ()=>{
    await User.deleteMany({})

    let user = new User({
        username : "faraz",
        email : "farazgreate@gmail.com"
    })

    await user.save()
}

const addPost = async()=>{

    await Post.deleteMany({})

    const userDoc = await User.findOne({username : "faraz"})

    let post = new Post({
        content : "This is a new post",
        likes : 10,
    })

    //Add a 'user' field and add the whole user document to it.
    //'user' field will now contain the reference of parent.
    post.user = userDoc;
    const response = await post.save()
    // console.log(response);//response will have complete userDoc object, but in DB only ObjectId is stored

    //We know there is only one document in post collection.
    const postDoc = await Post.findOne({})
    console.log(postDoc);
}

const getPost = async ()=>{
    //We know there is only one post in the DB.
    const postDoc = await Post.findOne({}).populate('user')
    //populate the 'user' field of the postDocument.

    // const postDoc = await Post.findOne({}).populate('user' , "username")
    //populate the 'user' field with only 'username' property of the red document

    console.log(postDoc);
}

// addUser() //Run it once
// addPost()
getPost()