const express=require('express');
const app=express();
app.use(express.json());
const cors = require('cors');
// Enable CORS for all origins (or specific origins)
app.use(cors({
  origin: 'http://localhost:3001', // Replace with the frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // If cookies or credentials need to be sent
}));
const {open}=require('sqlite');
const sqlite3=require('sqlite3');
const jwt=require('jsonwebtoken');
const path=require('path');
const bcrypt=require('bcrypt');
const db_path=path.join(__dirname,'TodoApllication.db');
let db=null;

let IntializeDataBase=async()=>{
    try{
        db=await open({
            filename:db_path,
            driver:sqlite3.Database
        })
        app.listen(3000,()=>{
            console.log('Server is Running at port number 3000')
        });
    }
    catch(e){
        console.log(`connection failed ${e.message}`);
        process.exit(1);
    }
}
IntializeDataBase();
/*JWT token verification will be held in this function if the token will not present */
const TokenVerify=(request,response,next)=>{
    let jwtToken=null;
    const authHeaders=request.headers["authorization"];
    if(authHeaders!=undefined){
        jwtToken=authHeaders.split(" ")[1]
    } 
    if(authHeaders===undefined){
        response.status(401).send("Their is no access token");
    }
    else{
        jwt.verify(jwtToken,"Satya",(error,payload)=>{
            if(error){
                response.status(401).send("Inavalid Access Token");
            }
            else{
                next();//then it will goes required method and that ill be excuted
            }
        })
    }
}
app.post('/register',async(request,response)=>{
    const{id,name,password}=request.body;
    const isUserExistedSqlQuery=`SELECT * FROM UserDetails WHERE name="${name}"`;
    const userExistedOrNOt=await db.get(isUserExistedSqlQuery);/* here we are following unique username system 
    so while registering we are checking whether any user is existed with that name if existed then we send an message 
    the username was existed so try with another name to the user */
    if(userExistedOrNOt===undefined){
         const hashedPassword=await bcrypt.hash(password,10);/* it is an secure way to store
         the user password in database here we are storing the bcrypted password in database instead of direct passowrd */
         const userRegisterSqlQuery=`INSERT INTO UserDetails (id,name,password)
         VALUES 
         ("${id}","${name}","${hashedPassword}")`
         await db.run(userRegisterSqlQuery);
         response.status(200).send({message:"User registerd successfully"})
    } 
    else{
        response.status(400).send({message:"User name is existed so try with another name"})
    }
});
app.post('/login',async(request,response)=>{
    const{name,password}=request.body;
    const getUserDetailsQuery=`SELECT * FROM UserDetails WHERE name="${name}"`
    const dbUserDetails=await db.get(getUserDetailsQuery);
    //checking whether user existed or not in database with the given name 
    if(dbUserDetails!==undefined){
        //checking whether user entered password is correct or not 
        const verifyPassword=await bcrypt.compare(password,dbUserDetails.password);
        if(verifyPassword===true){
            const payload={name:name}
            const token=jwt.sign(payload,"Satya");// it will sends an jwt token to the client after successfull login
            response.status(200).send({token});
        }
        else{
            response.status(401).send({message:"Invalid password"})
        }
    }
    else{
        response.status(401).send({message:"Invalid username"});
    }
})
app.post('/tasks',TokenVerify,async(request,response)=>{
    const{id,title,discription}=request.body;
    if(title.length!==0 && discription.length!==0){
        const intialStatus="pending";
        const sqlQuery=`INSERT INTO TodoData(id,title,discription,status) 
        VALUES
        ("${id}","${title}","${discription}","${intialStatus}")`
        await db.run(sqlQuery);
        response.status(200).send({message:"Task Posted Successfully"})
    }
    else{
        response.status(400).send({message:"We cannot add empty title and discription"})
    }
});
app.get('/tasks',TokenVerify,async (request,response)=>{
    const sqlQuery=`SELECT * FROM TodoData`
    const data=await db.all(sqlQuery)
    response.status(200).send({data})
});
app.get('/tasks/:id',TokenVerify,async(request,response)=>{
    const{id}=request.params;
    const sqlQuery=`SELECT * FROM TodoData
    WHERE id="${id}"`;
    const data=await db.get(sqlQuery);
    response.status(200).send(data);
});
app.delete('/tasks/:id',TokenVerify,async(request,response)=>{
    const{id}=request.params;
    const sqlQuery=`DELETE FROM TodoData
    WHERE id="${id}"`
    await db.run(sqlQuery);
    response.status(200).send({message:"Task delted from database"})
});
app.put('/tasks/:id',TokenVerify,async (request,response)=>{
    const{id}=request.params;
    const{status}=request.body;
    const sqlQuery=`UPDATE TodoData SET 
    status="${status}" WHERE id="${id}"`
    await db.run(sqlQuery);
    response.status(200).send({message:"Status updated successfully"})
});