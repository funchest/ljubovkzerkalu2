const mongoose = require("mongoose");
mongoose.model("Service",{
    name:{
        type: String,
        required: true
    },
    type:{
        type: Number,
        required: true
    },
    duration:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
});//rofl lmao kek kek2 molodoj