
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
    role: {
        type: String, 
        enum: ["user", "admin"], 
        default: "user", 
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
        if(this.isNew || this.isModified("password")) { //om nytt eller ändras 
            const encryptedPassword = await bcrypt.hash(this.password, parseInt(process.env.HASH));  //hasha
            this.password = encryptedPassword; 
        }
        next() 
    }catch(error) { //vid error
        next(error) 
    }
});
 
//----------------------------Skapa ny användare------------------------------//

userSchema.statics.register = async function(username, password, role) {
    try {
        //skapa användare och spara.
        const oneUser = new this({username: username.toLowerCase(), password, role}); 
        await oneUser.save(); 
        return oneUser; 
    } catch (error) { //vid error
        throw new Error(error.message);
    }
};


//---------------------Logga in---------------------------------------------------//

userSchema.statics.login = async function (username, password) {
    try {
        //hitta baserat på username
        const oneUser = await this.findOne({username: username.toLowerCase()}); 
        if(!oneUser) { 
            throw new error("Ogiltiga uppgifter"); }  
        
        //jämför lösenord
        const passwordMatch = await bcrypt.compare(password, oneUser.password);
        if(!passwordMatch) { 
            throw new error("Ogiltigta uppgifter");}
            
        return oneUser;
    } catch (error) {  //vid error
        throw new Error(error.message);
    }
};

//----------------------------------------------------------------------------//



//skapar model
const userModel = mongoose.model("userModel", userSchema);

//exporterar
module.exports = userModel;