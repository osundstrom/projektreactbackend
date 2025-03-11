const Router = require("@koa/router");
const router = new Router();
const reviewModel = require("./model/review");
const auth = require("./auth");

//---------------------------POST-----------------------------------------------//

router.post("/review",auth, async (ctx) => {
    try {
        
        const { bookId, userId, username, content, grade, post_created} = ctx.request.body;

        const review = new reviewModel({
            bookId,
            userId,
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

//---------------------------DELETE------------------------------------------//

router.delete("/review/:id",auth, async (ctx) => {
    const {id} = ctx.params; 
    try {
        
        const reviewDelete = await reviewModel.findByIdAndDelete(id); 
        
        if(!reviewDelete) { 
            ctx.status = 404; 
            ctx.body = {message: "Recensionen finns inte"};
            
        }else { 
            ctx.status = 200; 
            ctx.body = {message: "Recensionen raderad"}}

        } catch (error) { 
            ctx.status = 400; 
            ctx.body = {error: error.message};
    }
});


module.exports = router;