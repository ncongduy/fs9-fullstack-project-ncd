import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import UserServices from '../services/user'
import { BadRequestError, ForbiddenError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'

// POST /users/google-login
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as any
    const token = jwt.sign({ email: user?.email, role: user?.role }, JWT_SECRET)
    res.json({ user, token })
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// Authorization
export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user } = req as any
    const { role } = user
    if (role !== 'admin') return next(new ForbiddenError())
    next()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// POST /users
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User(req.body)
    await UserServices.create(user)
    res.json(user)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// PUT /users/:userId
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body
    const userId = req.params.userId
    const updateUser = await UserServices.update(userId, update)
    res.json(updateUser)
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// DELETE /users/:userId
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await UserServices.deleteUser(req.params.userId)
    res.status(204).end()
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /users/:userId
export const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await UserServices.findById(req.params.userId))
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}

// GET /users
export const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await UserServices.findAll())
  } catch (error) {
    if (error instanceof Error && error.name == 'ValidationError') {
      next(new BadRequestError('Invalid Request', error))
    } else {
      next(error)
    }
  }
}
