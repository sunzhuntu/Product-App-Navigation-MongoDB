require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('build'))

const Product = require('../models/product')

app.get('/', (request, response) => {
    response.send('<h1> this is a web server </h1>')
})
  
app.get('/api/products', (request, response) => {
    Product.find({}).then(products => {
      response.json(products)
      console.log('handle http get request')
    })
})

app.get('/api/products/:id', (request, response, next) => {
    Product.findById(request.params.id).then(product => {
      if (product){
        response.json(product)
      } else {
          response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/products/:id', (request, response, next) => {
    Product.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/products', (request, response, next) => {
    const body = request.body
    console.log('handle http post request')
    console.log(body)
  
    const product = new Product({
        title: body.title,
        category: body.category,
        available: Math.random > 0.5
    })
  
    product.save().then(savedProduct => {
      response.json(savedProduct.toJSON())
    })
    .catch(error => next(error))
  })

app.put('/api/products/:id', (request, response, next) => {
    const body = request.body
  
    const product = {
        title: body.title,
        category: body.category,
        available: body.available
    }
  
    Product.findByIdAndUpdate(request.params.id, product, { new: true })
      .then(updatedProduct => {
        response.json(updatedProduct)
      })
      .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError'){
      return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT 
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})