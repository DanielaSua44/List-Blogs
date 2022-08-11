const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')




blogsRouter.get('/', (request, response) => {
    Blog.find({}).then(blogs => {
        response.json(blogs)
    })
})

blogsRouter.get('/:id',(res,req,next) =>{
    Blog.findById(res.params.id)
    .then(blog =>{
        if(blog){
            res.json(blog)
        }else{
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author:body.author,
        url:body.url,
        likes:body.likes
    })

    blog.save()
    .then(savedBlog => {
        response.json(savedBlog)
    }).catch(error => next(error))
} )

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndRemove(request.params.id)
    .then(() => {
        response.status(204).end()
    }).catch(error => next(error))
} )

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author:body.author,
        url:body.url,
        likes:body.likes
    }
    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
        response.json(updatedBlog)
    }).catch(error => next(error))
} )

module.exports = blogsRouter
