/// <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express-flash
 */
declare namespace Express {
  export interface Request {
    flash(event: string, message: any): any
    user?: {
      _id: string
      firstName: string
      lastName: string
      email: string
      role: string
      createAt: Date
      updateAt: Date
    }
  }
}

interface Flash {
  flash(type: string, message: any): void
}

declare module 'express-flash'
