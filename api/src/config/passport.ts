import GoogleTokenStrategy from 'passport-google-id-token'
import { ExtractJwt, Strategy } from 'passport-jwt'

import UserService from '../services/user'
import { GOOGLE_CLIENT_ID, JWT_SECRET } from '../util/secrets'

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
  },
  async (parsedToken: any, googleId: any, done: any) => {
    try {
      const userInfo = {
        firstName: parsedToken?.payload?.['given_name'],
        lastName: parsedToken?.payload?.['family_name'],
        email: parsedToken?.payload?.email,
      }
      const user = await UserService.findOrCreate(userInfo)

      done(null, user)
    } catch (err) {
      done(err, {})
    }
  }
)

export const jwtStrategy = new Strategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  (payload: any, done: any) => {
    try {
      const { role, email } = payload
      const user = {
        email,
        role,
      }
      done(null, user)
    } catch (err) {
      done(err, {})
    }
  }
)
