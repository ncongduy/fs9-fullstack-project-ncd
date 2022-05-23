import GoogleLogin from 'react-google-login'

import userApi from '../../fetchApi/userApi'
import { UserDocument } from '../../types'

type Props = {
  onUser: React.Dispatch<React.SetStateAction<UserDocument | null>>
}

function LoginByGoogle({ onUser }: Props) {
  const responseSuccess = async (response: any) => {
    const tokenId = response?.tokenId
    const res: any = await userApi.googleLogin({
      id_token: tokenId,
    })

    const { user, token } = res
    localStorage.setItem('access_token', token)
    onUser(user)
  }

  const responseFailure = async (response: any) => {
    onUser(null)
  }
  return (
    <GoogleLogin
      clientId="628027389160-6mlqifinuua7mrgeml4qa0g9g4j2sbe2.apps.googleusercontent.com"
      buttonText="Google"
      onSuccess={responseSuccess}
      onFailure={responseFailure}
      cookiePolicy={'single_host_origin'}
    />
  )
}

export default LoginByGoogle
