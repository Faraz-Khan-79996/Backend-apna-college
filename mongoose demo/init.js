const mongoose = require('mongoose')
const Chat = require('./models/chat')

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/whatsapp');
  console.log('database connected');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

Chat.insertMany([
    {
        from : "faraz",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "Arin",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "Manasvi",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "Isha",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "kanishka",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "sanksar",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
    {
        from : "teesha",
        to : "abhishek",
        msg : "send Notes",
        created_at : new Date(),
    },
])
.then(response =>{
    console.log(response);
})