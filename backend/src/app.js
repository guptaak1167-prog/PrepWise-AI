const express=require('express');
const cookieParser=require('cookie-parser');
const cors = require("cors")
const app=express();
const port=3000;
app.use(cookieParser());
app.use(express.json());

const interviewRoutes = require('../src/routes/interview.routes.js');

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));


app.use(express.urlencoded({ extended: true }));
/* all the required routes here */
const authRouter=require("./routes/auth.routes");
const interviewRouter=require("./routes/interview.routes");
/* using routes use here*/
app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports=app;

//mucmap-3pacMi-rowmag

// mongodb+srv://Akash:mucmap-3pacMi-rowmag@prepwise-ai-cluster.g2crfqg.mongodb.net/prepwise-ai
