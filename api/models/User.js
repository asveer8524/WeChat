const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:[true,"Please add the user name"],
        },
        password:{
            type:String,
            required:[true,"please add the user email address"],
        }
    },
    {
        timestamps:true,
    }
);


module.exports=mongoose.model("User",UserSchema);
