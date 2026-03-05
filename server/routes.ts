import { Express } from "express";
import { Server } from "http";

export async function registerRoutes(httpServer:Server, app:Express){

// middleware to check login
function isAuthenticated(req:any,res:any,next:any){

if(!req.session.user){
return res.status(401).json({message:"Not logged in"})
}

req.user = req.session.user
next()

}

// LOGIN ROUTE
app.post("/api/login",(req:any,res)=>{

const {email} = req.body

const regex = /^[a-zA-Z0-9]+@nitt\.edu$/

if(!regex.test(email)){
return res.status(400).json({message:"Use NITT email"})
}

const rollno = email.split("@")[0]

req.session.user = {
id:rollno,
email
}

res.json({
message:"login success",
user:req.session.user
})

})


// LOGOUT
app.post("/api/logout",(req:any,res)=>{

req.session.destroy(()=>{
res.json({message:"logged out"})
})

})


// TEST PROTECTED ROUTE
app.get("/api/me",isAuthenticated,(req:any,res)=>{

res.json(req.user)

})

return httpServer
}