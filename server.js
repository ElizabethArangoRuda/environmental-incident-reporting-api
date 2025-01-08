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

app.use('/api/form', userform);

/*app.get('/hola',(req,res)  => {
  res.send('Que mas pues');
});*/

// Start the server
app.listen(8080, () => {
    console.log(`server is running on 8080
      press cntrl + C to stop`);
  
  });
  