const express=require("express");
const app=express();
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const axios=require("axios");
mongoose.connect("mongodb+srv://thealx98:chmoshniki->nahuj1@cluster0-2aaw0.azure.mongodb.net/shop?retryWrites=true", { useNewUrlParser: true });
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
require("./Order");
const Order=mongoose.model("Order");

app.post("/order",(req,res)=>{
    console.log(req);
    var newOrder={
        Customer: req.body.Customer,
        ServiceID: req.body.ServiceID,
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    };
    var order = new Order(newOrder);
    order.save().then(()=>{
        console.log("order created");
        var src = "Заказ был принят: на имя " + req.body.Customer + ", дата + " + req.body.deliveryDate;
        res.render(__dirname + "/order.html", {src:src});
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
});
app.get("/orders",(req,res)=>{
    Order.find().then((orders)=>{
        var nice=orders;
        res.render(__dirname +"/order.html",{nice:nice});
    }).catch((err)=>{console.log(err)});
});
app.get("/orders/:id",(req,res)=>{
    Order.findById(req.params.id).then((order)=>{
        if(order){
            axios.get("http://localhost:8888/customers/"+order.CustomerID).then((response)=>{
                var orderObject={
                    customerName: response.data.name, 
                    serviceName:''
                };
                axios.get("http://localhost:5000/services/"+order.ServiceID).then((r)=>{
                    orderObject.serviceName=r.data.name;
                    res.json(orderObject);
                });
            });
            
        }else{
            res.sendStatus(404);
        }
    }).catch(err=>{
        if(err){
            throw err;
        }
    });
    
});
app.listen("5050",()=> {console.log("orders started")});