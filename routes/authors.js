const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i') // case insensitive
    }

    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query 
        })
    } catch {
        res.redirect('/')
    }
})

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

// Create Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    }catch {
        res.render('authors/new',{
            author: author,
            errorMessage:'Error Creating Author...'
        })
    }

    // author.save().
    // then((newAuthor)=>{
    //     res.render('authors')
    // }).
    // catch((err)=>{
    //     res.render('authors/new',{
    //         author: author,
    //         errorMessage:'Error Creating Author...'
    //     })
    // })
})


router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author: author})
    } catch {
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        const author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    }catch {
        if (author == null){
            res.redirect('/')
        } else {
            res.render('authors/edit',{
                author: author,
                errorMessage:'Error Updating Author...'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    console.log(`delete: ${req.params.id}`)
    let author
    try {
        const deleteCount = await Author.findOneAndDelete({_id: req.params.id})
        console.log(`delete1: ${deleteCount} `)
        res.redirect('/authors')
    }catch (err){
        console.log(err)
        if (author == null){
            console.log(`delete author is null : ${req.params.id}`)
            res.redirect('/')
        } else {
            console.log(`delete author is not null: ${author.id}`)
            res.redirect(`authors/${author.id}`)
        }
    }
})

module.exports = router