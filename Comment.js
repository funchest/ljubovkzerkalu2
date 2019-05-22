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
    text:{
        type: String,
        required: true
    }
});