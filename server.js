import express from "express";
import cors from "cors";
import fs from "fs";
import userform from './routes/userform.js'

// create an instance of express
const app = express();

// Middleware
app.use(cors());

// Parse JSON request bodies
app.use(express.json()); 

// This middleware allows us to serve static files
app.use(express.static("./public")); 

app.use('/form', userform);


// Start the server
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}
      press cntrl + C to stop`);
  
  });
  