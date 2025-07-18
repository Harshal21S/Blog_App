const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URL;

console.log('MongoDB URI:', uri);

mongoose.connect("mongodb+srv://hsakhare2153:harsh2003@cluster0.zddnne8.mongodb.net/blog-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
