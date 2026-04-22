import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import "dotenv/config";
const app = express();
const port =3000;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/",(req, res)=>{
    res.send("hello world");

});
app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`);
});
