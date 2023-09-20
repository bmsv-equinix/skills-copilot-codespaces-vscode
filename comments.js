// Create web server
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const posts = {}

// posts === {
//     '1234': {
//         id: '1234',
//         title: 'post title',
//         comments: [
//             { id: '123', content: 'comment content' }
//         ]
//     }
// }

// app.get('/posts/:id/comments', (req, res) => {
//     res.send(posts[req.params.id].comments)
// })

app.get('/posts/:id/comments', async (req, res) => {
    res.send(posts[req.params.id].comments)
})

app.post('/posts/:id/comments', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { content } = req.body
    const comments = posts[req.params.id].comments || []
    comments.push({ id, content })
    posts[req.params.id].comments = comments
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id,
            content,
            postId: req.params.id
        }
    })
    res.status(201).send(comments)
})

app.post('/events', (req, res) => {
    console.log('Event Received:', req.body.type)
    res.send({})
})

app.listen(4001, () => {
    console.log('Listening on 4001')
})