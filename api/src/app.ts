import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'
import cors from 'cors'

import booksRouter from './routers/book'
import usersRouter from './routers/user'
import bookLoansRouter from './routers/bookLoan'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import { googleStrategy, jwtStrategy } from './config/passport'

dotenv.config({ path: '.env' })
const app = express()
const corsOrigin = { origin: 'http://localhost:3000' }

// Express configuration
app.set('port', process.env.PORT || 5000)

// Global middleware
app.use(apiContentType)
app.use(express.json())
app.use(cors(corsOrigin))

// Passport configuration
app.use(passport.initialize())
passport.use(googleStrategy)
passport.use(jwtStrategy)

// Set up routers
app.use('/api/v1/books', booksRouter)
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/bookloans', bookLoansRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
