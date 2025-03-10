const Router = require('@koa/router');
const router = new Router();

//model
const userModel = require("./model/user.js");

//JWT
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//----------------------------POST, register--------------------------------------------------//

router.post("/register", async (ctx) => {
    try {

    const {username, password} = ctx.request.body;

    if (!username || !password) {
        ctx.status = 400;
        ctx.body = {error: "Användarnamn eller lösen saknas"};
        return;
    }
 
    else if (username.length < 6 ) { 
        ctx.status = 400;
        ctx.body = { error: "Minst 6 tecken i användarnamnet" };
        return; 
    }

    else if (password.length < 8 ) { 
        ctx.status = 400;
        ctx.body = { error: "Minst 8 tecken i lösenordet" };
        return; 
    }

    else if (!/[A-ZÅÄÖ]/.test(password)) {  
        ctx.status = 400;
        ctx.body = { error: "Lösenordet måste ha en stor bokstav" };
        return;
    }
    
    else if (!/[0-9]/.test(password)) { 
        ctx.status = 400;
        ctx.body = { error: "Lösenordet måste ha minst en siffra" };
        return;
    }

    const oneUser = await userModel.register(username, password);
    ctx.status = 201;
    ctx.body = {message: "Användare sparad"}; 

    } catch (error) { 
        ctx.status = 500; 
        ctx.body = {error: error.message};
    }
});

//---------------------------Post, logga in -----------------------------------------//


router.post("/login", async (ctx) => {

    const { username, password } = ctx.request.body;
    try {
        
        const oneUser = await userModel.login(username, password);
       
        const token = jwt.sign({
            id: oneUser._id}, 
            process.env.JWT_SECRET_KEY, 
            {expiresIn: "1h"}); 

        ctx.status = 200; 
        ctx.body = {
        message: `Inloggad som: ${username}`,
        recivedToken: {token}, 
        };

    } catch (error) {
        ctx.status = 401; 
        ctx.body = {error: error.message}; 
    }
});


module.exports = router;
