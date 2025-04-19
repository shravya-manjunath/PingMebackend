import server from "./index.js";
import { dbConnect } from "./db.config.js";

server.listen(process.env.PORT,()=>{
    console.log(`Progrem started in port ${process.env.PORT}`);
    dbConnect();
})