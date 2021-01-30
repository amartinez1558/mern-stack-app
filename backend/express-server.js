const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
// MONGODB
const mongoose = require('mongoose')
const mongoUser = 'mernapp';
const mongoPass = '<yourpassword>'
const url = `mongodb+srv://${mongoUser}:${mongoPass}@cluster0.oczsj.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection
db.once('open', () => {
  console.log('Database connected!', url)
})

db.on('error', err => {
  console.error('Connection error!', err)
})

// EXPRESS
app.use(bodyParser.json())
 
app.use((req, res, next) => {
 res.setHeader("Access-Control-ALlow-Origin", "*");
 res.setHeader(
   "Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept"
 );
 res.setHeader(
   "Access-Control-Allow-Methods",
   "GET, POST, PUT, DELETE, OPTIONS"
 )
 next();
})

const POSTS = [
  { 
    subject: "Express message!",
    description: "Hello from Express!" 
  },
  { 
    subject: "Express message #2!",
    description: "Hello from Express!" 
  },
  { 
    subject: "Express message #3!",
    description: "Hello from Express!" 
  },
]


const Post = require('./models/Post')

const getPosts = async() => {
  return Post.find()
    .catch(err => {
      console.error(err);
    }) 
}

app.get('/posts', async (req, res, next) => {
  setTimeout(async () => {
    const allPosts = await getPosts()
    res.json(allPosts)
    next();
  }, 2000)
  
})

const savePost = async (post) => {
  const newPost = new Post({
    ...post
  })
  return newPost.save()
                .catch(err => {
                  console.error(err);
                }) 
}

app.post('/posts', async (req, res, next) => {
  const newPost = req.body
  const createdPost = await savePost(newPost)
  res.status(201).json(createdPost)
  next();
})
 
const deletePost = async (postId) => {
  Post.deleteM
  console.log(await Post.findOneAndDelete({ _id: postId }))
}

app.delete('/posts/:id', async (req, res, next) => {
  const postId = req.params.id
  await deletePost(postId)
  res.status(204).json({})
  next();
})

const resetDB = async () => {
  Post.deleteMany({}, () => {})
  POSTS.forEach( async (post) => {
    await savePost(post)
  })
}

resetDB()
 
app.get('/', (req, res, next) => {
	res.json({ message: "Hello from Express!" })
	next();
})

const server = http.createServer(app);
server.listen(process.env.PORT || 4200);