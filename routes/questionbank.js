const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Topic = require('../models/Topic');
const Question = require('../models/Question');
// const Test = require('../models/Test');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const { error } = require("console");


cloudinary.config({
    cloud_name:process.env.cloud_name, 
    api_key:process.env.api_key, 
    api_secret:process.env.api_Secret
});


const Upload = {
    uploadFile: async (filePath) => {
      try {
        const result = await cloudinary.uploader.upload(filePath);
        return result;
      } catch (error) {
        throw new Error('Upload failed: ' + error.message);
      }
    },
  };


router.get('/create/question/bank', async(req,res) =>{
    res.render('./questionbank/createques.ejs')
  })


  
  // Define the route
router.post('/create-ques', upload.single("file"), async (req, res) => {
     try {
      const {subject,chapter,topic,correct} = req.body;
      const result = await Upload.uploadFile(req.file.path);
      const imageUrl = result.secure_url
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting local file:', err);
        } else {
          console.log('Local file deleted successfully');
        }
      });
      const newQuestion = new Question({ 
        SubjectName : subject,
        ChapterName : chapter,
        TopicName: topic,
        Question : imageUrl,
        Option1 : "Option 1",
        Option2 : "Option 2",
        Option3 : "Option 3",
        Option4: "Option 4",
        CorrectOption:correct
      });
      await newQuestion.save();
  
      console.log(imageUrl)
      console.log(subject)
      res.json(result); // Send the upload result as a response
    } catch (error) {
      console.error(error);
      res.status(500).send('Upload failed.');
    }
  });
  
router.get('/create/information', (req,res) => {
    res.render('./questionbank/createinfo.ejs')
  })
  
router.post('/create/subject', async(req,res) => {
    let {subject} = req.body;
    const newsubject = new Subject({ 
                            Name: subject
                           });
     await newsubject.save();
  })
  
router.post('/create/chapter', async(req,res) => {
    let {subject,chapter} = req.body;
    const newsubject = new Chapter({ 
                            SubjectName:subject,
                            ChapterName:chapter
                           });
     await newsubject.save();
  })
  
router.post('/create/topic', async(req,res) => {
    let {subject,chapter,topic} = req.body;
    const newsubject = new Topic({ 
                            SubjectName:subject,
                            ChapterName:chapter,
                            TopicName:topic
                           });
     await newsubject.save();
  })
  


module.exports = router;
