const express=require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const html = require("html");
const path = require('path');
const nodeMailer = require('nodemailer');
var sms = require('free-mobile-sms-api');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: '6c044964',
    apiSecret: 'VFdWOiffsqtFl911'
})

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.use(express.static(__dirname));



require("./Service");
const Service=mongoose.model("Service");

require("./Order");
const Order=mongoose.model("Order");

require("./Comment");
const Comment=mongoose.model("Comment");



app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://thealx98:chmoshniki->nahuj1@cluster0-2aaw0.azure.mongodb.net/shop?retryWrites=true", { useNewUrlParser: true });

app.get("/",(req,res)=>{
    Service.find({}).lean().then((arr)=>{
        console.log("1");


        //arr=JSON.parse(arr);
        console.log(arr);
        arr=JSON.stringify(arr);
        res.render(__dirname +"/index.html",{arr:arr});
        console.log("done");
    }).catch(err=>{
        if(err){throw err;}
    });
});


app.post("/services",(req,res)=>{
    

    var newService = {
        name  : req.body.name,
        type  : req.body.type,
        duration: req.body.duration,
        price : req.body.price
    };
    console.log(newService.name+ " " + newService.type+ " " + newService.duration+ " " + newService.price);
    var service = new Service(newService);
    service.save().then(()=>{
        console.log("new service");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
    

    res.send("a new service has been added");
});
app.get("/formen",(req,res)=>{
    Service.find({type:1}).lean().then((arr)=>{
        arr=JSON.stringify(arr);
        res.render(__dirname +"/formen.html",{arr:arr});
    }).catch(err=>{
        if(err){throw err;}
    });
});
app.get("/forwomen",(req,res)=>{
    Service.find({type:2}).lean().then((arr)=>{
        arr=JSON.stringify(arr);
        res.render(__dirname +"/forwomen.html",{arr:arr});
    }).catch(err=>{
        if(err){throw err;}
    });
});
app.get("/forkids",(req,res)=>{
    Service.find({type:3}).lean().then((arr)=>{
        arr=JSON.stringify(arr);
        res.render(__dirname +"/forkids.html",{arr:arr});
    }).catch(err=>{
        if(err){throw err;}
    });
});

app.post("/comment",(req,res)=>{
    var newComment={
        CustomerName: req.body.CustomerName,
        ServiceID: req.body.ServiceID,
        date: curday("/"),
        text: req.body.text
    }
    var comment = new Comment(newComment);
    comment.save().then(()=>{

        Service.findById(newComment.ServiceID).then((service)=>{
            if(service){
                Order.find().lean().then((arr)=> {
                    Service.find().lean().then((arr2)=> {
                        Comment.find({ServiceID:newComment.ServiceID}).lean().then((arr3)=> {
                            arr2=JSON.stringify(arr2);
                            arr = JSON.stringify(arr);
                            service = JSON.stringify(service);
                            arr3=JSON.stringify(arr3);

                            res.render(__dirname + "/order.html", {service: service, arr: arr,arr2:arr2,arr3:arr3});
                        }).catch(err=>{
                            if(err){
                                throw err;
                            }
                        });
                    }).catch(err=>{
                        if(err){
                            throw err;
                        }
                    });
                }).catch(err=>{
                    if(err){
                        throw err;
                    }
                });
            }else{
                res.sendStatus(404);
            }
        }).catch(err=>{
            if(err){
                throw err;
            }
        });


    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
});




app.get("/services/:id",(req,res)=>{
    Service.findById(req.params.id).then((service)=>{
        if(service){
            Order.find().lean().then((arr)=> {
                Service.find().lean().then((arr2)=> {
                    Comment.find({ServiceID:req.params.id}).lean().then((arr3)=> {
                        arr2=JSON.stringify(arr2);
                        arr = JSON.stringify(arr);
                        service = JSON.stringify(service);
                        arr3=JSON.stringify(arr3);

                        res.render(__dirname + "/order.html", {service: service, arr: arr,arr2:arr2,arr3:arr3});
                    }).catch(err=>{
                        if(err){
                            throw err;
                        }
                    });
                }).catch(err=>{
                    if(err){
                        throw err;
                    }
                });
            }).catch(err=>{
                if(err){
                    throw err;
                }
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
app.delete("/services/:id",(req,res)=>{
    Service.findByIdAndDelete(req.params.id).then(()=>{
        res.send("service removed " + req.params.id);
    }).catch(err=>{
        if(err){
            throw err;
        }
    });
});

app.post("/order",(req,res)=>{
    var d =0;
    var name= "",price;
    console.log(req);
    Service.findById(req.body.ServiceID).then((service)=>{
        d=service.duration;
        name=service.name;
        price=service.price;
        console.log("******************************************" + req.body.deliveryDate);
        var newOrder={
            CustomerName: req.body.CustomerName,
            ServiceID: req.body.ServiceID,
            serviceDuration : d,
            email: req.body.email,
            phonenum: (req.body.phonenum).replace(/\D/g,''),
            initialDate: curday("/"),
            deliveryDate: req.body.deliveryDate
        };
        if(
            (
                ( !(newOrder.email).includes("@") || !(newOrder.email).includes(".") )

                && (newOrder.email).length<6

            ) || !(newOrder.phonenum).length>9)
        {
            console.log("*********NOT SAVING*********");
            return
        }

1
        let transporter = nodeMailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'aleksndr.fomitsjov@gmail.com',
                pass: 'ezggyeshnhukfijp'
            }
        });
        let mailOptions = {
            from: 'aleksndr.fomitsjov@gmail.com', // sender address
            to: 'thealx98@hotmail.com', // list of receivers
            subject: "новый клиент", // Subject line
            text: "новый клиент: " + newOrder.CustomerName + ", телефон: " + newOrder.phonenum + ", email "+newOrder.email +"\n заказал: " + name + ", дата: " + newOrder.deliveryDate // plain text body

        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);

        });





        var order = new Order(newOrder);
        order.save().then(()=>{
            var link = "http://localhost:5000/orders/" + order.id;

            if((newOrder.email).includes("@")){

                let mailOptions2 = {
                    from: 'aleksndr.fomitsjov@gmail.com', // sender address
                    to: newOrder.email, // list of receivers
                    subject: "Любовь к Зеркалу Напоминание", // Subject line
                    text: "Дорогая(ой) " + newOrder.CustomerName + "\nСпасибо что выбрали наш салон красоты\nВы заказали " + name + ", дата " + newOrder.deliveryDate + "(мес/день/год)\nЕсли вдруг передумали то перейдите по ссылке: " + link

                };

                transporter.sendMail(mailOptions2, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);

                });
            }



            if((newOrder.phonenum).length>9) {
                const from = 'Ljuboj K Zerkalu Bot';
                const to = newOrder.phonenum;
                const text = 'Dorogaja(oj) ' + newOrder.CustomerName + '\nVi zakazali ' + name + ', \ndata ' + newOrder.deliveryDate + '(мес/день/год),\nTsena ' + price + "€\nEsli hotite otmenitj to perejdite po ssilke: \n" + link;
                console.log("***********\nsending SMS to " + newOrder.phonenum + "\n" + link);
                //nexmo.message.sendSms(from, to, text);
            }


            console.log("order created "+ order.id);
            var src = "Заказ был принят: на имя " + newOrder.CustomerName + ", дата " + newOrder.deliveryDate + " услуга " + name;
            res.render(__dirname + "/index.html", {src:src});
        }).catch((err)=>{
            if(err){
                throw err;
            }
        });
    }).catch(err=>{
        if(err){
            throw err;
        }
    });
});



app.post("/orders/delete/:id",(req,res)=>{
    console.log("deleted" + req.params.id);
    Order.findByIdAndDelete(req.params.id).then(()=>{
        var src = "Спасибо заказ успешно удален";
       res.redirect("/");

        //res.render(__dirname + "../../index.html", {src:src});
    }).catch(err=>{
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
    var srv;
    Order.findById(req.params.id).then((order)=>{
        if(order){

            Service.findById(order.ServiceID).then((service)=>{
                srv=service.name;
                var ord=JSON.stringify(order);
                res.render(__dirname +"/deleteOrder.html",{ord:ord,srv:srv});

            }).catch((err)=>{
                console.log(err);
                res.sendStatus(404);
            });




            //5ce1e269851dfe1e2ca60219






           /* axios.get("http://localhost:8888/customers/"+order.CustomerID).then((response)=>{
                var orderObject={
                    customerName: response.data.name,
                    serviceName:''
                };
                axios.get("http://localhost:5000/services/"+order.ServiceID).then((r)=>{
                    orderObject.serviceName=r.data.name;
                    res.json(orderObject);
                });
            });*/

        }else{
            res.sendStatus(404);
        }
    }).catch(err=>{
        if(err){
            throw err;
        }
    });

});



app.listen(5000,()=>{
    console.log("running");
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

var curday = function(sp){
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var min = today.getMinutes();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    if(hours<10) hours='0'+hours;
    if(min<10)min='0'+min;
    //return (yyyy+sp+mm+sp+dd+" " +hours+":"+min);
    return (mm+sp+dd+sp+yyyy+" " +hours+":"+min);
};