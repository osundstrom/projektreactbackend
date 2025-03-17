const Router = require("@koa/router");
const router = new Router();
const reviewModel = require("./model/review");
const auth = require("./auth");

//---------------------------POST-----------------------------------------------//

router.post("/review",auth, async (ctx) => {
    try {
        
        const { bookId, userId, title, username, content, grade, post_created} = ctx.request.body;

        const review = new reviewModel({
            bookId,
            userId,
            title,
            username,
            content,
            grade,
            post_created
        });

        await review.save(); 
        ctx.status = 201; 
        ctx.body = {message: "recension tillagd", review};
        
    } catch (error) { 
        console.error(error);
        ctx.status = 400;
        ctx.body = {error: error.message};
        ctx.message = "Något gick fel";
    }
});


//---------------------------GET baserat bookId----------------------------------//
router.get("/reviews", async (ctx) => {
    try {
        const reviewsBooks = await reviewModel.find(); 

        ctx.body = reviewsBooks;

    } catch (error) {
        ctx.status = 500;
        ctx.body = { error: error.message };
    }
});



//---------------------------GET baserat bookId----------------------------------//
router.get("/review/:bookId", async (ctx) => { 
    try {
        const oneIdBook = ctx.params.bookId;
        const reviewsBook = await reviewModel.find({bookId: oneIdBook}); 
        
        if (reviewsBook.length > 0) {
            ctx.body = reviewsBook; 
        } else { 
            ctx.status = 400; 
            ctx.message = "Inga recensioner finns"  
        }

    } catch (error) { 
        ctx.status = 500; 
        ctx.body = {Error: error.message}; 
    }
});


//---------------------------GET baserat _id----------------------------------//
router.get("/review/one/:id", async (ctx) => { 
    try {
        const id = ctx.params.id;
        const reviewsBook = await reviewModel.findById(id);
        
        if (reviewsBook) {
            ctx.body = reviewsBook; 
        } else { 
            ctx.status = 400; 
            ctx.message = "Inga recensioner finns"  
        }

    } catch (error) { 
        ctx.status = 500; 
        ctx.body = {Error: error.message}; 
    }
});

//---------------------------GET baserat på användare----------------------------------//

router.get("/reviews/user/:userId",auth, async (ctx) => {
    try {
        const userId = ctx.params.userId;
        const userReviews = await reviewModel.find({ userId: userId });

        if (userReviews.length > 0){
            ctx.body = userReviews; 
        } else{ 
            ctx.status = 400; 
            ctx.message = "Inga recensioner hittades";  
        }

    } catch (error) { 
        ctx.status = 500; 
        ctx.body = {error: error.message }; 
    }
});

//---------------------------DELETE------------------------------------------//

router.delete("/review/:id",auth, async (ctx) => {
    const id = ctx.params.id;
    const user = ctx.state.user;
    try {
        
        const reviewDelete = await reviewModel.findById(id); 
        
        if(!reviewDelete) { 
            ctx.status = 404; 
            ctx.body = {message: "Recensionen finns inte"};
            
        }
        if(user.role === "admin") {
            await reviewModel.findByIdAndDelete(id);
            ctx.status = 200;
            ctx.body = { message: "Recensionen raderad" };
            return;
        }

        if(reviewDelete.userId === user.id) {
            await reviewModel.findByIdAndDelete(id);
            ctx.status = 200;
            ctx.body = { message: "Recensionen raderad" };
            return;
        }
        else { 
            ctx.status = 403; 
            ctx.body = {message: "Ej behörig"}}

        } catch (error) { 
            ctx.status = 400; 
            ctx.body = {error: error.message};
    }
});


//---------------------------PUT------------------------------------------//

router.put("/review/:id", auth, async (ctx) => { 
    try {
        const id = ctx.params.id;

        
        const updatedReview = await reviewModel.findByIdAndUpdate(id, ctx.request.body);

        if (updatedReview) {
            ctx.status = 200; 
            ctx.body = { message: "Uppdaterad"};
        } else {
            ctx.status = 404; 
            ctx.body = { message: "Recensionen finns inte" };
        }

    } catch (error) { 
        ctx.status = 400; 
        ctx.body = {
            message: "Misslyckad förfrågan", 
            error: error.message 
        };
    }
});

module.exports = router;