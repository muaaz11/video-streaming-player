import dotenv from "dotenv"
import connectDB from "./db/database.js";


dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`);
        
    })
})
.catch((error) => {
    console.log("Mongodb connection failed: ", error);
    
})