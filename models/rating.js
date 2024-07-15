//it will contain structure of the rating
const mongoose = require('mongoose');


const ratingSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    },
});
//model nhi bnana h->_id __version vagera de dega
//mongoose.model nhi use kiye isliye
module.exports=ratingSchema;