import express, { Router } from "express";
import dotenv from 'dotenv';
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import mongoose from "mongoose";

dotenv.config({ path: './.env' });
const port = process.env.PORT;
const app = express();

app.use(express.json());

mongoose.connect(process.env.URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));

app.use("/contacts", contactRoutes);
app.use("/user", userRoutes);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`);
})