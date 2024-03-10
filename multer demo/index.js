const express = require('express')
const ejs = require('ejs');
const path = require('path')
require('dotenv').config()

const multer  = require('multer')
const uploadOnCloudinary = require('./util/cloudinary.js')

//we're setting files will get stored in disk.
//destination and filename has a functions which defines
//path of storage and name of stored file respectively
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)

    cb(null , file.originalname)
  }
})

// const upload = multer({ dest: 'uploads/' })
//using this will save files in uploads directory.
const upload = multer({ storage: storage })


const app = express()



app.set('view engine', 'ejs');
app.use(express.static('uploads'))
//We've made upload as static. Can be directly accessed now inside any file.


app.get('/', (req, res) => {
  res.render('file_input_form')
})

//upload.methods() is the middleware
//'name_of_file' is the name of the input field which is taking file.
app.post('/post' ,upload.single('name_of_file') ,async (req , res)=>{

  //best to give complete path itself.
  //send the file path to the function, it will return a response object.
  const response = await uploadOnCloudinary(path.join(__dirname , req.file.destination ,req.file.originalname))
  // console.log(response);
  res.json({file : req.file ,url : response.url})
})

app.listen(3000)
