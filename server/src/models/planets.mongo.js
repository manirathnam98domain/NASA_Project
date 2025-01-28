const moongose = require('mongoose');

const planetSchema = new moongose.Schema({
    keplerName:{
        type:String,
        required:true
    }
});

module.exports = moongose.model("Planet",planetSchema);