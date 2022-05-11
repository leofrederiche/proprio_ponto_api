const mongoose = require('mongoose')

const password = process.env.MONGO_PASSWORD
const environment = process.env.NODE_ENV
const query = `mongodb+srv://propio_ponto:${password}@cluster0.yiyr2.mongodb.net/${environment}?retryWrites=true&w=majority`

mongoose.Promise = global.Promise

mongoose.connect(
    query,
    { 
        useNewUrlParser : true,
        useUnifiedTopology: true 
    }, 
    function(error) {
        if (error) {
            console.log("Error!" + error);
        }
    }
)

module.exports = mongoose