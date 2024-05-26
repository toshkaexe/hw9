import {app} from "./settings";
import dotenv from "dotenv";
import {runDB} from "./db/db";
dotenv.config();


const port = 3000;
const startApp =async ()=>{
    await runDB()
    app.listen(port,()=>{
        console.log(`Example app listening on port ${port}`)
    })
}


startApp()