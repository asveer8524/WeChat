const mongoose=require("mongoose");

async function connectDB()
{
    try{
        const connect=await mongoose.connect(process.env.Connection_String);
        console.log(`Database connected sucessfully : ${mongoose.connection.host} ,  ${mongoose.connection.name} `);
    }
    catch(err)
    {
        console.log(err);
        process.exit(1);

    }
}

module.exports = connectDB;