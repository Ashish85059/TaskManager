import express, { json } from "express";
const app=express();
import morgan from "morgan";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import taskRouter from "./Routes/taskRouter.js";
import cors from "cors";


// dot env
dotenv.config()
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    res.send("hello world!");
})

app.use("/api/v1/task", taskRouter);

app.use("*", (req, res) => {
  res.status(404).json({ msg: "No route found" }); // 404 not found handler
});


try {
  await mongoose.connect(process.env.MONGO_URL2);
  console.log("DB connected");
} catch (error) {
  console.log(error);
}

app.listen(port,() => {
  console.log(`Server running on port ${port} `);
});
