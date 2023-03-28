import mongoose from "mongoose";
const empSchema = new mongoose.Schema(
    {
        firstName:{
            type : String,
            required: true,
            min: 2,
            max: 50
        },
        lastName:{
            type : String,
            required: true,
            min: 2,
            max: 50
        },
        email:{
            type : String,
            require: true,
            min: 2,
            max: 50
        },
        reportTo:{
            type:Array,
             default:[]
        },
        role:{
            type : String,
            min: 2,
            max: 50,
            default: 'employee'
        },
            
        
    },
    {  timestamps: true }
);

const emp =  mongoose.model("harbinger_employees", empSchema)

export default emp;