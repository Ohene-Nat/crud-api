import express from 'express';
import {Client} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app= express();
app.use(express.json());

const con= new Client({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
con.connect().then(()=>
    console.log("connected to database"))