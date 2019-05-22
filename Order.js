const mongoose = require("mongoose");
mongoose.model("Order",{
    CustomerName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:false
    },
    phonenum:{
        type: String,
        required:false
    },
    ServiceID:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true
    },
    serviceDuration:{
        type: Number,
        required: true
    },
    initialDate:{
        type:String,
        required:true
    },
    deliveryDate:{
        type:String,
        required:true
    }
});