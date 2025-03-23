const Router = require("@koa/router");
const router = new Router();
const reviewModel = require("./model/review");
const auth = require("./auth");

//---------------------------POST-----------------------------------------------//

router.post("/review",auth, async (ctx) => {
    try {
        //hämtra från body
        const { bookId, userId, title, username, content, grade, post_created} = ctx.request.body;

        //ny recension
        const review = new reviewModel({ 
            bookId,
            userId,
            title,
            username,
            content,
            grade,
            post_created
        });

        await review.save(); //spara
        ctx.status = 201; 
        ctx.body = {message: "recension tillagd", review};
        
    } catch (error) { //vid error
        console.error(error);
        ctx.status = 400;
        ctx.body = {error: error.message};
        ctx.message = "Något gick fel";
    }
});


//---------------------------GET baserat bookId----------------------------------//
router.get("/reviews", async (ctx) => {
    try {
        //hämtar alla recensioner
        const reviewsBooks = await reviewModel.find(); 

        ctx.body = reviewsBooks;

    } catch (error) { //vid error
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});



//---------------------------GET baserat bookId----------------------------------//
router.get("/review/:bookId", async (ctx) => { 
    try {
        const oneIdBook = ctx.params.bookId; //bookId
        //hämta alla recensionr för boken
        const reviewsBook = await reviewModel.find({bookId: oneIdBook}); 
        
        if (reviewsBook.length > 0) { //om det finns
            ctx.body = reviewsBook; 
        }else { //annars tom 
            ctx.status = 200; 
            ctx.body = []; 
        }

    } catch (error) { //vid error
        ctx.status = 500; 
        ctx.body = {Error: error.message}; 
    }
});


//---------------------------GET baserat _id----------------------------------//
router.get("/review/one/:id", async (ctx) => { 
    try {
        const id = ctx.params.id;//id
        //Hämta just den recensionen baserat på id
        const reviewsBook = await reviewModel.findById(id);
        
        if (reviewsBook) { //om finns
            ctx.body = reviewsBook; 
        } else { 
            ctx.status = 400; 
            ctx.message = "Inga recensioner finns"  
        }

    } catch (error) { //vid error
        ctx.status = 500; 
        ctx.body = {Error: error.message}; 
    }
});

//---------------------------GET baserat på användare----------------------------------//

router.get("/reviews/user/:userId",auth, async (ctx) => {
    try {
        const userId = ctx.params.userId; //userid

        //hämtar alla användaren recensioner
        const userReviews = await reviewModel.find({ userId: userId });

        if (userReviews.length > 0){ //om finns
            ctx.body = userReviews; 
        } else{ 
            ctx.status = 400; 
            ctx.message = "Inga recensioner hittades"; 
            ctx.body = []; 
        }

    } catch (error) { //vid error
        ctx.status = 500; 
        ctx.body = {error: error.message }; 
    }
});

//---------------------------DELETE------------------------------------------//

router.delete("/review/:id",auth, async (ctx) => {
    const id = ctx.params.id; //id
    const user = ctx.state.user; //användare
    try {
        //hämta baserat på id
        const reviewDelete = await reviewModel.findById(id); 
        
        if(!reviewDelete) { //om ej hittas
            ctx.status = 404; 
            ctx.body = {message: "Recensionen finns inte"};
            
        }
        if(user.role === "admin") { //om admin
            await reviewModel.findByIdAndDelete(id); //radera alla recenioner
            ctx.status = 200;
            ctx.body = { message: "Recensionen raderad" };
            return;
        }

        if(reviewDelete.userId === user.id) { //Om samma användare
            await reviewModel.findByIdAndDelete(id);
            ctx.status = 200;
            ctx.body = { message: "Recensionen raderad" };
            return;
        }
        else { 
            ctx.status = 403; 
            ctx.body = {message: "Ej behörig"}}

        } catch (error) {  //vid error
            ctx.status = 400; 
            ctx.body = {error: error.message};
    }
});


//---------------------------PUT------------------------------------------//

router.put("/review/:id", auth, async (ctx) => { 
    try {
        const id = ctx.params.id; //id

        //uppdatera baserat på id
        const updatedReview = await reviewModel.findByIdAndUpdate(id, ctx.request.body);

        if (updatedReview) { //om finns
            ctx.status = 200; 
            ctx.body = { message: "Uppdaterad"};
        } else {
            ctx.status = 404; 
            ctx.body = { message: "Recensionen finns inte" };
        }

    } catch (error) {  //vid erro
        ctx.status = 400; 
        ctx.body = {
            message: "Misslyckad förfrågan", 
            error: error.message 
        };
    }
});

module.exports = router;