const mongoose = require("mongoose");
mongoose.model("Comment",{
    CustomerName:{
        type: String,
        required:true
    },
    ServiceID:{
        type: mongoose.SchemaTypes.ObjectId,
        required:true
    },
    date:{
        type: String,
        required: true
    },
    mark:{
        type: Number,
        required: false
    },
    text:{
        type: String,
        required: false
    }
});