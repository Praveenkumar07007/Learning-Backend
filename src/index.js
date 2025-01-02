//require("dotenv").config({path: __dirname + "/.env"});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config(`path: "./.env"`);

connectDB().then(()=>{
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}).catch((error) => {
  console.log("mongodb connection error: ", error);
  process.exit(1);
});



























// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");
//     app.on("error", (error) => {
//       console.log("ERROR: ", error);
//       throw new Error(error);
//     });

//     app.listen(process.env.PORT, () => {
//       console.log(`Server is running on http://localhost:${process.env.PORT}`);
//     });
//   } catch (error) {
//     console.log("ERROR: ", error);
//     throw new Error(error);
//   }
// })();
