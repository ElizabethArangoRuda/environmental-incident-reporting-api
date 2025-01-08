import express from "express";
import cors from "cors";
import fs from "fs";
import userform from './routes/userform.js'
import "dotenv/config";

// create an instance of express
const app = express();

// Middleware
app.use(cors());

// Parse JSON request bodies
app.use(express.json()); 

// This middleware allows us to serve static files
app.use(express.static("./public")); 

// complaints route
app.use('/api/complaints', userform);

/*app.get('/hola',(req,res)  => {
  res.send('Que mas pues');
});*/

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    console.log('Press Ctrl + C to stop the server');
  
  });
  