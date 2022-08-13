const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')




blogsRouter.get('/',async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id',async(res,req) =>{
    const blog = await Blog.findById(req.params.id)
    if(blog){
        res.json(blog)
    }else{
        res.status(404).end()
    }
})

blogsRouter.post('/', async(request, response) => {
    const body = request.body

    if(body.title === undefined || body.url === undefined){
        return response.status(400).json({error:'title and url are required'})
    }

    const blog = new Blog({
        title: body.title,
        author:body.author,
        url:body.url,
        likes:body.likes
    })

    const newBlog = await blog.save()
    response.json(newBlog)
} )

blogsRouter.delete('/:id', async(request, response, next) => {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
} )

blogsRouter.put('/:id', async(request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author:body.author,
        url:body.url,
        likes:body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
} )
    

module.exports = blogsRouter
