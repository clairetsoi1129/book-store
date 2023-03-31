const mongoose = require('mongoose')
const validator = require('validator')

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
    coverImage: {
        type: Buffer,
        required: [true, 'Please upload a cover image.']
    },
    coverImageType: {
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
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book', bookSchema)