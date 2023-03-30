import  express  from "express";
import emp from "./emp.js";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";

import helmet from "helmet";
import cors from "cors"
import bodyParser from "body-parser";



import dotenv from "dotenv";
import { constants } from "buffer";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));

app.use(cors());
const port = process.env.PORT || 3001

app.use(bodyParser.urlencoded({extended: true}))

const staticPath = path.join(__dirname, '../Client')

async function getManager (ids){

  let reportTo_empoylee= ids.map(async(data)=>{


    let emp_data= await emp.findById(data).exec();
    let emp_details={firstName:emp_data.firstName,
    lastName:emp_data.lastName,
    email: emp_data.email,role:emp_data.role}
            return emp_details
            })
    let result = await Promise.all(reportTo_empoylee)
            return result



}


 
async function createEmp (reportTo){
      
  

 const res = reportTo.map(async(details)=>{
let emp_id
let employee = await emp.findOne({email:details.email}).exec();


 if(employee == null) {
    const firstName=  details.firstName;
    const  lastName= details.lastName;
     const email= details.email;
     const role = details.role;
     const newEmp= new emp({
           firstName,
          lastName,
           email,
           role
        })
      const savedEmp= await newEmp.save();
     emp_id = savedEmp._id


  }else{
    
    emp_id = employee._id
    
  }
  
  
  return (emp_id)
  
  
  
    }) 

    
const data = await Promise.all(res)
  return (data)
}








// const index =  app.use(express.static(staticPath))

app.get('/:email',  async (req,res)=>{
  try {
    let manager;
      const {email} = req.params;
      let employee = await emp.findOne({email}).exec();
if(employee.reportTo.length > 0){
 manager = await getManager(employee.reportTo);
        
      }

 
     
      res.status(200).json({id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email:employee.email,
        reportTo: manager,
        role: employee.role
      });

      
  } catch (err) {
      res.status(404).json({message: err.message})
      
  }
});


app.delete('/all', async (req,res)=>{
await emp.deleteMany({})
res.status(200).send("Deleted")
})




// app.get('/', getUsers);
app.post('/', async (req, res) => {
  try{
    
     const {
         firstName,
         lastName,
         email,
         reportTo,
         role
      } = req.body
if(reportTo){
       const ids= await createEmp(reportTo);
}
    

    const newEmp= new emp({
      firstName,
      lastName,
      email,
      reportTo:ids,
      role
   })
   const savedUser= await newEmp.save();
   console.log(savedUser)
   res.status(201).json(savedUser)
 
 }catch(err){
 res.status(500).json({error : err.message});
 }});

 app.patch('/', async (req, res) => {
  try{
    
     const {
         firstName,
         lastName,
         email,
         reportTo,
         role,
         id
      } = req.body
      const originalData= await emp.findById(id)
const managerObjId = await Promise.all (reportTo.map(async(element)=>{
 const manager=  await emp.findById(element)
 return (manager._id)
}))

const managerUpdate= [...originalData.reportTo,...managerObjId]
console.log((managerUpdate))
       await emp.findByIdAndUpdate(id,{firstName,lastName,role,reportTo: managerUpdate})     
    const updatedEmp = await emp.findById(id)

   
   
   res.status(201).json(updatedEmp)
 
 }catch(err){
 res.status(500).json({error : err.message});
 }});




mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  app.listen(port, ()=> console.log(`Server is live on Port: ${port}`));
}).catch((error)=> console.log(`${error} did not connect`))