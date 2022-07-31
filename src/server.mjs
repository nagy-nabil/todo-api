import {signUP, signIN, protect} from "./utils/auth.mjs"
import ItemRouter from "./resources/item/item.router.mjs";
import UserRouter from "./resources/user/user.router.mjs";
import express from "express";
import bp from 'body-parser'
import morgan from 'morgan'
import {connect} from './utils/db.mjs'

const app = express()
app.disable('x-powered-by')
app.use(morgan('dev'));
app.use(bp.json())
app.use(express.urlencoded({ extended: true }))

app.use('/app/signup',signUP);
app.use('/app/signin',signIN);

app.use('/api',protect);
app.use('/api/item',ItemRouter)
app.use('/api/user',UserRouter)
export const start=async ()=>{
    try{
        await connect();
        app.listen(8000, ()=>{
            console.log("listening on 8000")
        })
    }catch(err){
        console.log(err);
    }
}