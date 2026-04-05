import express from 'express';
import {Client} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const app= express();
app.use(express.json());
const PORT = 3000;

const con= new Client({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})
con.connect().then(()=>
    console.log("connected to database"))

app.post('/postdata', async (req, res)=>{
    const data = Array.isArray(req.body) ? req.body : [req.body];
    
    try {
        for (const item of data) {
            const {name, age} = item;
            const insert_query= `INSERT INTO demo(name, age) VALUES($1, $2) RETURNING *`;
            await new Promise((resolve, reject) => {
                con.query(insert_query,[name,age],(err,result)=>{
                    if(err) reject(err);
                    else {
                        console.log(result)
                        resolve(result)
                    }
                })
            })
        }
        res.send("POSTED DATA")
    } catch (err) {
        res.send(err)
    }
})

app.get('/getdata', async (req, res)=>{
    const select_query= `SELECT * FROM demo`;
   con.query(select_query,(err,result)=>{
    if(err)
    {
        res.send(err)
    }else{
        console.log(result)
        res.send(result.rows)
    }
   })
})

app.get('/fetchbyId/:id', async (req, res)=>{
    const {id}= req.params;
    const select_query= `SELECT * FROM demo WHERE id =$1`;
   con.query(select_query,[id],(err,result)=>{
    if(err)
    {
        res.send(err)
    }else{
        console.log(result)
        res.send(result.rows[0])
    }
   })
})

app.put('/updatedata/:id', async (req, res)=>{
    const {id}= req.params;
    const {name}= req.body;
    const update_query= `UPDATE demo SET name=$1 WHERE id=$2 RETURNING *`;
    con.query(update_query,[name, id],(err,result)=>{
        if(err)
        {
            res.send(err)
        }else{
            console.log(result)
            res.send("DATA UPDATED")
        }
    })
})

app.delete('/deletedata/:id', async (req, res)=>{
    const{id} = req.params;
    const detete_query= `DELETE FROM demo WHERE id=$1 RETURNING *`;
    con.query(detete_query,[id],(err,result)=>{
        if(err)
        {
            res.send(err)
        }else{
            console.log(result)
            res.send("DATA DELETED")
        }
    })
})
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
    
})