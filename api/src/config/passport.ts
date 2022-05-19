import passport from 'passport'
import passportLocal from 'passport-local'
import { Request, Response, NextFunction } from 'express'
// declaration merging
import GoogleTokenStrategy from 'passport-google-id-token'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { GOOGLE_CLIENT_ID, JWT_SECRET } from '../util/secrets'

// const LocalStrategy = passportLocal.Strategy

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
  },
  (parsedToken: any, googleId: any, done: any) => {
    console.log('parsed token: ', parsedToken)
    console.log('google id: ', googleId)
    //const user = User.findOrCreate(parsedToken)

    // fake user
    const user = {
      firstName: 'Pauli',
      lastName: 'Nguyen',
      email: 'pauli@gmail.com',
      createAt: '2022-05-18',
      updateAt: '2022-05-18',
    }

    done(null, user)
  }
)

export const jwtStrategy = new Strategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (payload: any, done: any) => {
    console.log('payload: ', payload)
    console.log('done: ', done)

    done(null, {})
  }
)
