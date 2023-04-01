const mongoose = require('mongoose')

const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre("findOneAndDelete", async function (next) {

    // Book.find({ author: this._id}, (err, books) => {
    //     if (err) {
    //         console.log(`findOneAndDelete err: ${err}`)
    //         next(err)
    //     } else if (books.length > 0){
    //         console.log('findOneAndDelete 2nd error')
    //         next(new Error('This author has books still'))
    //     } else {
    //         console.log('findOneAndDelete next')
    //         next()
    //     }
    // })
    try {
        const query = this.getFilter();
        const hasBook = await Book.exists({ author: query._id })
  
        if (hasBook) {
            console.log('findOneAndDelete: This author still has books')
            next(new Error("This author still has books."))
        } else {
            console.log('findOneAndDelete: This author does not have book')
            next()
        }
    } catch (err) {
        console.log(`findOneAndDelete error: ${err}`)
        next(err)
    }
});

module.exports = mongoose.model('Author', authorSchema)