const mongoose = require('mongoose')
const path = require('path')
const validator = require('validator')

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title.'],
        unique: [true, 'Title already exist.']
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: [true, 'Please enter a publish date.']
    },
    pageCount: {
        type: Number,
        required: [true, 'Please enter a page count.']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required: [true, 'Please upload a cover image.']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Please enter an author.'],
        ref: 'Author'
    }
})

//schema middleware to apply before saving
bookSchema.pre('save', async function(next) {
      next();
});

bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath