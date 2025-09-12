
 import express from 'express';


const app=express()




    app.use(express.json());


    app.get("/",(req,res)=>{
        
    })



app.listen(8000,()=>{

    console.log(" server started at 8000" );
    
})