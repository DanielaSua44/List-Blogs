const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blogs')
const helper = require('./test_helper')

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
        likes: 0
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Test blog')
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

afterAll(() => {
    mongoose.connection.close()
} )