
//dotenv
require("dotenv").config();

//mongoose
const mongoose = require("mongoose");

//bcrypt
const bcrypt = require("bcrypt");


//---------------------------------Schema--------------------------------------//


//schema 
const userSchema = new mongoose.Schema({
    username: { 
        type: String,
        require: true, 
        unique: true, 
        trim: true, 
    },
    password: { 
        type: String,
        required: true, 
    },
    acc_created: { 
        type: Date,
        default: Date.now,
        
    }},
    { collection: "user" }); //Collection



//-------------Lösenordet Hashas innan det sparas-------------------------//


//pre-hook, den körs innan något sparas till databasen
userSchema.pre("save", async function(next) { 
    try{
        if(this.isNew || this.isModified("password")) { 
            const encryptedPassword = await bcrypt.hash(this.password, parseInt(process.env.HASH)); 
            this.password = encryptedPassword; 
        }
        next() 
    }catch(error) { 
        next(error) 
    }
});
 
//----------------------------Skapa ny användare------------------------------//

userSchema.statics.register = async function(username, password) {
    try {
        const oneUser = new this({username: username.toLowerCase(), password}); 
        await oneUser.save(); 
        return oneUser; 
    } catch (error) { 
        throw new Error(error.message);
    }
};


//---------------------Logga in---------------------------------------------------//

userSchema.statics.login = async function (username, password) {
    try {
        const oneUser = await this.findOne({username: username.toLowerCase()}); 
        if(!oneUser) { 
            throw new error("Ogiltiga uppgifter"); }  

        const passwordMatch = await bcrypt.compare(password, oneUser.password);
        if(!passwordMatch) { 
            throw new error("Ogiltigta uppgifter");}
            
        return oneUser;
    } catch (error) { 
        throw new Error(error.message);
    }
};

//----------------------------------------------------------------------------//



//skapar model
const userModel = mongoose.model("userModel", userSchema);

//exporterar
module.exports = userModel;