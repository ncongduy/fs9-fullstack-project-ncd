import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'

import booksRouter from './routers/book'
import usersRouter from './routers/user'
import bookLoansRouter from './routers/bookLoan'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 5000)

// Global middleware
app.use(apiContentType)
app.use(express.json())

// Set up routers
app.use('/api/v1/books', booksRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/bookloans', bookLoansRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
