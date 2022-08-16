const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
} )

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
} )


test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
} )

test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('React patterns')
}
)

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'www.test.com',
        likes: 0,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${process.env.TOKEN}`)
        .end( async (err, res) => {
            if (err) {
                console.log(err)
            }
            expect(res.status).toBe(201)
            expect(res.body.title).toBe('Test blog')
            expect(res.body.author).toBe('Test author')
            expect(res.body.url).toBe('www.test.com')
            expect(res.body.likes).toBe(0)
        } )
        .expect(201)
        .expect('Content-Type', /application\/json/)



    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)


} )

test('a blog without likes is set to 0', async () => {
    const newBlog = {
        title: 'Test blog',
        author: 'Test author',
        url: 'www.test.com'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const likes = response.body.map(r => r.likes)
    expect(likes).toContain(0)
} )

test('a blog without title is not added', async () => {
    const newBlog = {
        author: 'Test author',
        url: 'www.test.com',
        likes: 0
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
} )

test('Ibentificador unco id',async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
} )

test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
} )

test('succeds witch status code 200 if update is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedBlog = {
        title: 'Updated blog',
        author: 'Updated author',
        url: 'www.updated.com',
        likes: 0
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)

    expect(titles).toContain('Updated blog')
} )

afterAll(() => {
    mongoose.connection.close()
} )