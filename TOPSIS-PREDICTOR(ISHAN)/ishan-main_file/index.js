const __dirname = dirname(fileURLToPath(import.meta.url));
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import multer from "multer";
import { readFile } from 'node:fs';
import fs from "fs";
import { upload_file } from "./cloudinary.js";
// import csv from "csv-parser";
import util from "util"
import csv from "csvtojson";
import { json2csv } from "csvjson-json2csv";
import {topsis} from "./function.js"
import { email_send } from "./email.js";
import {deleteFirstColumn} from "./delete_first_column.js";
dotenv.config()



const app=express();
const port=process.env.PORT;
app.use(express.static(__dirname+'/public'));
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname +'/uploads');
  },
  filename: function (req, file, cb) {
    
    cb(null,`${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage })
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan('tiny'));



app.get("/",(req,res) => {
  // console.log(req.body);
res.sendFile(__dirname + "/public/index.html");
});




app.post("/submit",upload.single('upload_file'),(req,res)=>{
  const csvFilePath=req.file.path;






  const imp=req.body.impacts.split(',')
  console.log(imp);
  const impactsArray = [];
  for (const impact of imp) {
  if (impact === '+') {
    impactsArray.push(1);
  } else {
    impactsArray.push(-1);
  }}






  const weight=req.body.weights.split(',');
  const weightsArray=[];
  for(const i of weight){
    const val=parseFloat(i);
    weightsArray.push(val);
  }






  

  (async()=>{
    const data=await csv({checkType:true , delimiter:"auto", output:"json"}).fromFile(req.file.path);
    // console.log(data);
    let matrix = [];
    for (const obj of data) {
    const row = Object.values(obj);
    matrix.push(row);
    }
    console.log(matrix)

     



    if(req.body.drop_column === 'yes'){
      matrix=deleteFirstColumn(matrix);
    }




    if(matrix[0].length!=impactsArray.length && matrix[0].length!=weightsArray.length){
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      res.render(__dirname+'/views/final.ejs',{message: "Both the number of weights and impacts are not equal to number of columns in data" , dimension:"both"})
      return;
    }

    if(matrix[0].length!=weightsArray.length){
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });  
      res.render(__dirname+'/views/final.ejs',{weight: "Number of weights are not equal to number of columns in data" , dimension:"weight"})
        return;
    }

    if(matrix[0].length!=impactsArray.length){
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully");
        }
      });
      res.render(__dirname+'/views/final.ejs',{impacts: "Number of impacts are not equal to number of columns in data", dimension:"impact"})
      return;
    }



    const rankings=topsis(matrix,weightsArray,impactsArray);
    for(let i=0;i<data.length;i++){
      data[i].ranking_of_topsis=rankings[i];
    }
    console.log(data);
    
    const csvdata=json2csv(data);
    fs.writeFile('./uploads/answers.csv',csvdata,(err)=>{
      if (err) throw err;
      console.log("ok");
    })
    const path='./uploads/answers.csv';



    
    









    const email=req.body.email;
   
    try {
      const uploadResult = await upload_file(path, req.file.filename);
      const response = await email_send(email, path);
  
      res.render(__dirname + "/views/final.ejs", {
        a: response.message, // Use a more descriptive variable name
        b: uploadResult.secure_url,// Assuming secure_url holds the URL
        dimension:"matched", 
      });
    } catch (error) {
      console.error("Error during upload or email sending:", error);
      res.status(500).render(__dirname + "/views/final.ejs", {
        error: "An error occurred. Please try again later.",
        dimension:"something"
        
      });
    }
    

    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });

    fs.unlink('./uploads/answers.csv', (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });


  })();

  




 



  
  
});






app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
 
  



  