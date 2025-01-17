console.log('hello world');

// const http = require('http');

import http from 'http';
import express, { response } from 'express';
import exp from 'constants';
import cors from 'cors';


const app =  express();
app.use(cors())


app.use(express.json())

const requestLogger = (request , response , next) => {
    console.log('Method:', request.method)
    console.log('Path:', request.path)
    console.log('Body:', request.body)
    console.log('---')
    next()
}


app.use(requestLogger)



let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    } ,
    {
        id: "5",
        content: "Tested CORS",
        important: false
      }
  ]


// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end(JSON.stringify(notes))
// })
app.get('/' , (reques , response) => {
    response.send('<h1>Hello World How are u</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

// view paticular note

app.get('/api/notes/:id', (request , response ) => {
    const id = request.params.id 
    const note = notes.find(note => note.id === id)
    if(note){
        response.json(note)
    }else {
        response.status(404).end()
    }
})


// generate id 


const generateId = () => {
    const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
    return String(maxId + 1)

}

app.post('/api/notes', (request , response) => {
    
    const body = request.body

    if(!body.content){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note ={
        content: body.content,
        important: body.important || false,
        id: generateId(),
    }
    
       
    notes = notes.concat(note)
    console.log(note)
    response.json(note)
})

// //delete note 

app.delete('/api/notes/delete/:id', (request , response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
   
    response.status(204).end()
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)



const PORT = 3001
app.listen(PORT , () => {
    console.log(`Server running on port ${PORT}`)

})


