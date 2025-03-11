//mongoose
const mongoose = require("mongoose");

//schema 
const reviewSchema = new mongoose.Schema({
    bookId: { 
        type: String,
        required: true, 
        trim: true, 
    },
    userId: {
        type: String,
        required: true, 
    },
    username: {
        type: String,
        required: true, 
    },
    content: { 
        type: String,
        required: true, 
    },
    grade: { 
        type: Number,
        required: true, 
    },
    post_created: { 
        type: Date,
        default: Date.now,
    }},
    { collection: "reviews" });

//skapar model
const reviewModel = mongoose.model("reviewModel", reviewSchema);

//exporterar
module.exports = reviewModel;