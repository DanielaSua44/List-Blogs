const _=require('lodash')


const dummy= (blogs) => {
    return 1
    }

const totalLikes = (blogs) => {
    _.reduce(blogs, (sum, item) => {
        return sum + item.likes
    }, 0)

    return blogs.length === 0 ? 0 : blogs.reduce((sum, item) => {
        return sum + item.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    _.reduce(blogs, (max, item) => {
        return max.likes > item.likes ? max : item
    } , blogs[0])
    return blogs.length === 0 ? {} : blogs.reduce((max, item) => {
        return max.likes > item.likes ? max : item
    } , blogs[0])
}
console.log(favoriteBlog)

const mostBlogs = (blogs) => {
   _.reduce(blogs, (max, item) => {
         return max.blogs > item.blogs ? max : item
    } , blogs[0])
    return blogs.length === 0 ? {} : blogs.reduce((max, item) => {
        return max.blogs > item.blogs ? max : item
    } , blogs[0])
}

const mostLikes = (blogs) => {
  _.reduce(blogs, (max, item) => {
        return max.likes > item.likes ? max : item
    }
    , blogs[0])
    return blogs.length === 0 ? {} : blogs.reduce((max, item) => {
        return max.likes > item.likes ? max : item
    } , blogs[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}