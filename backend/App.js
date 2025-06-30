// Import necessary modules
const express = require('express') // Import the express framework
const mongoose = require('mongoose') // Import the mongoose library for MongoDB interaction
const cors = require('cors') // Import the cors middleware for handling Cross-Origin Resource Sharing
const UserSchema = require('./modules/UserModel') // Import the User schema from the specified path
const bycrypt = require("bcrypt")

// Define server port and MongoDB connection URI
const PORT = 5000; // Define the port number the server will listen on
const URI = "mongodb://localhost:27017/health_tracker" // Define the MongoDB connection URI

const app = express() // Create an express application instance

// Configure middleware
app.use(express.json()) // Use the express.json() middleware to parse JSON request bodies

// Connect to MongoDB database
mongoose.connect(URI)
  .then(()=>console.log("connected to health_tracker database")) // Log a success message if the connection is successful
  .catch((err)=>console.log("Connection error : ",err)) // Log an error message if the connection fails

// Create a Mongoose model from the User schema
const User = mongoose.model('User', UserSchema);


const createUser = async(user)=>{
  try{
  const hashedPassword =await bycrypt.hash(user.password, 10)
  console.log(hashedPassword)
  const newUSer = new User({
    username:user.username,
    email: user.email,
    password: hashedPassword,
    waterData: [],
    sleepData: []
  })

  try{
    const savedUser = await newUSer.save();
    console.log("user data saved: ", savedUser)
  }catch(err){
    console.log("can't save user "+ err)
  }
  }
  catch(err){
    console.log("can not register user", err)
  }
  
}



app.post('/register', async(req, res)=>{
    try{
      const {username,email,password} = req.body
      if(!username|| !email || !password){
        return res.status(400).json({error:"all fields are required"})
      }
      const existingUser = await User.findOne({email})
      if(existingUser.email === email){
        return res.status(400).json({error:"Email already registered"})
      }

      createUser({username, email, password})
      res.status(200).send("registered succesfully")

    }catch(error){
      res.status(500).json({error: "Internal server error"})
      console.log("Unsuccessful registeration", error)
    }


});

app.get('/users', async (req, res)=>{
  try{

    const users = await User.find()

    res.status(200).send(users)
  }catch(error) {res.status(400).send(error)}
})



app.listen(PORT,()=>{
  console.log("health tracker app running on http://localhost:"+PORT)
})
