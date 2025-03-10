//---------------------------Allt som krävs----------------------------------//
//dotenv
require("dotenv").config();

//koa
const koa = require("koa");

//bodyparser
const bodyParser = require("koa-bodyparser");

//mongoose
const mongoose = require("mongoose");

//cors
const cors = require("@koa/cors");

//routers
const userRouter = require("./routes/userRoute.js"); 
const reviewRouter = require("./routes/reviewRoute.js"); 


//---------------------------Använder----------------------------------//

//använder koa
const app = new koa();


//använd cors
app.use(cors());

//använd bodyparser
app.use(bodyParser());


//---------------------------Routes----------------------------------//

app.use(userRouter.routes());
app.use(reviewRouter.routes());



//---------------------------Ansluter mongodb----------------------------------//

mongoose.connect(process.env.URL)
  .then(() => {
    console.log("Ansluten")})
  .catch(error => {
    console.log("Misslyckades", error)});


//---------------------------startar----------------------------------//

app.listen(process.env.PORT, () => {
    console.log("Startat server");
});