import {app} from "./app.js"
import { connectDB } from "./DB/index.db.js";

const port = process.env.PORT || 8080;


connectDB()
  .then(
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    })
  )
  .catch((error) => {
    console.log("MongoDB connection failed !!! ", error);
  });