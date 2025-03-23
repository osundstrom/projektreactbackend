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

    const {username, password, role} = ctx.request.body;//hämta användare och lösen

    if (!username || !password) { //Om ej finns
        ctx.status = 400;
        ctx.body = {error: "Användarnamn eller lösen saknas"};
        return;
    }
 
    else if (username.length < 6 ) {  //måste ha 6 tecken
        ctx.status = 400;
        ctx.body = { error: "Minst 6 tecken i användarnamnet" };
        return; 
    }

    else if (password.length < 8 ) { //måste ha 8 teckne
        ctx.status = 400;
        ctx.body = { error: "Minst 8 tecken i lösenordet" };
        return; 
    }

    else if (!/[A-ZÅÄÖ]/.test(password)) {  //stor bokstav
        ctx.status = 400;
        ctx.body = { error: "Lösenordet måste ha en stor bokstav" };
        return;
    }
    
    else if (!/[0-9]/.test(password)) {  //en siffra
        ctx.status = 400;
        ctx.body = { error: "Lösenordet måste ha minst en siffra" };
        return;
    }

    //skapa användare
    const oneUser = await userModel.register(username, password, role);
    ctx.status = 201;
    ctx.body = {message: "Användare sparad"}; 

    } catch (error) {  //vid error
        ctx.status = 500; 
        ctx.body = {error: error.message};
    }
});

//---------------------------Post, logga in -----------------------------------------//


router.post("/login", async (ctx) => {

    const { username, password } = ctx.request.body;
    try {
        //logga in genom modellen
        const oneUser = await userModel.login(username, password);
       
        const token = jwt.sign({ //skapar en token om anvöändaren finns
            id: oneUser._id, role: oneUser.role}, //id och roll
            process.env.JWT_SECRET_KEY, 
            {expiresIn: "1h"}); 

        ctx.status = 200; 
        ctx.body = {
        message: `Inloggad som: ${username} {id: ${oneUser._id}}`,
        recivedToken: {token}, 
        userId: oneUser._id,
        username: oneUser.username,
        role: oneUser.role,
        };

    } catch (error) {
        ctx.status = 401; 
        ctx.body = {error: error.message}; 
    }
});


module.exports = router;
