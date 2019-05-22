const express=require("express");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
require("./Comment");
const app=express();
app.use(bodyParser.json());
mongoose.connect("mongodb+srv://thealx98:chmoshniki->nahuj1@cluster0-2aaw0.azure.mongodb.net/shop?retryWrites=true", { useNewUrlParser: true });
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');


const Comment=mongoose.model("Comment");

app.post("/comment",(req,res)=>{
    var newComment={
        CustomerID: req.body.CustomerID,
        orderID: req.body.orderID,
        date: req.body.date,
        text: req.body.text
    }
    var comment = new Comment(newComment);
    comment.save().then(()=>{
        res.send("comment added");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
});

app.get("/comments",(req,res)=>{
    Comment.find().then((Comments)=>{
        res.json(Comments);
    }).catch(err=>{
        if(err){throw err;}
    });
});

app.get("/comments/:id",(req,res)=>{
     Comment.findById(req.params.id).then((comments)=>{
         console.log(comments);
         if(comments){
            res.json(comments);
        }else{
            res.sendStatus(404);
        }
     }).catch(err=>{
        if(err){
            throw err;
        }
    });
});

app.listen("4000",()=> {console.log("comments started")});