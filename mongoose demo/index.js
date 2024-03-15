const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const Chat = require('./models/chat')
const methodOverride = require('method-override')
//used to take request other than POST and GET directly from <form>


main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/whatsapp');
  console.log('database connected');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const app = express()
app.set("view engine", 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// method-override middleware

app.get('/', (req, res) => {
  res.json({ msg: "hi!" })
})

app.get('/chats', async (req, res) => {
  const chats = await Chat.find()
  //chats is an array
  res.render('index', { chats })
})

app.get('/chats/form', (req, res) => {
  res.render('form')
})

app.get('/chats/edit/:id', (req, res) => {
  const { id } = req.params;

  Chat.findById(id)
    .then(response => {
      res.render('edit', { chat: response })
    })
    .catch(error => {
      res.send('NOT FOUND')
    })
})

app.put('/chats/edit/:id', (req, res) => {
  const { id } = req.params;
  const { msg } = req.body;

  Chat.findByIdAndUpdate(id,
    { msg },
    { runValidators: true, }
  )
    .then(response => {
      res.redirect('/chats')
    })
    .catch(err => {
      res.send('NOT FOUND')
    })
})
app.post('/chats', async (req, res) => {
  const { from, to, msg } = req.body;

  // This is one method
  // const chatDoc = await Chat.create({from , to , msg , created_at : new Date()})
  // res.send(chatDoc)

  //Another method
  //create instance of Chat and save() it
  const new_chat = new Chat({ from, to, msg, created_at: new Date() })
  const chatDoc = await new_chat.save()
  res.json(chatDoc)
})

app.delete('/chats/:id' , (req , res)=>{
    const {id} = req.params;
    Chat.findByIdAndDelete(id)
    .then(response =>{
      res.redirect('/chats')
    })
    .catch(err =>{
      res.send('NOT FOUND')
    })
})

app.listen(3000)