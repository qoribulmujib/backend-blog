import express from "express";
import db from "./config/Database.js";
import router from "./routes/index.js";
import dotEnv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
// import bodyParser from "body-parser";
dotEnv.config();
const app = express();

try {
  await db.authenticate();
  console.log("Database connected");
  //ini akan membuat table kalo beluma da table di databse
  //   await Users.sync();
} catch (error) {
  console.error(error);
}
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(fileUpload());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(express.urlencoded());

app.listen(5000, () => console.log("Server running at port 5000"));
