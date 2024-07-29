const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())

app.get('/posts', (req, res) => {
    res.send('Return posts successfully')
})

app.get('/post/:id', (req, res) => {
    const { id } = req.params;
    res.send(`This is post with id: ${id}`);
})

app.post('/post/:id', (req, res)=> {
    const {id} = req.params;
    const { tile, content, author} =req.body
    const response = {
        data: {
          tile: tile ,
          content: content,
          author: author
        },
        message: "User created successfully"
      };
    
      res.json(response);
})

app.put('/post/:id', (req, res)=> {
    const {id} = req.params;
    const { tile, content, author} =req.body
    const response = {
        data: {
          tile: tile ,
          content: content,
          author: author
        },
        message: "Post updated successfully"
      };
    
      res.json(response);
})

app.patch('/post/:id', (req, res)=> {
    const {id} = req.params;
    const { tile} =req.body
    const response = {
        data: {
          tile: tile ,
        },
        message: "Post updated successfully"
      };
    
      res.json(response);
})

app.delete('/post/:id', (req, res) => {
    const {id} = req.params
    res.send(`Deleted post with id: ${id} successfully!`)
} )

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})