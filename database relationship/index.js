const mongoose = require('mongoose');


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

//One to few approach.
//parent will have subojects in the form of array.
//or you can say child.

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('database connected');
}

const addUser = async ()=>{
    await User.deleteMany({})

    let user1 = new User({
        username : "Faraz the great",
        addresses : [
            {
                location : "milky way galaxy",
                city : "indore",
            }
        ]
    })

    user1.addresses.push({location:"universe7" , city:"earth"})
    let result = await user1.save()
    console.log(result);
}


addUser()
