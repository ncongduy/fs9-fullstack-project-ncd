import { useContext } from 'react'
import GoogleLogin from 'react-google-login'

import userApi from '../../fetchApi/userApi'
import { GlobalContext } from '../../contexts'

function LoginByGoogle() {
  const { setUser, setError } = useContext(GlobalContext)

  const responseSuccess = async (response: any) => {
    const tokenId = response?.tokenId
    const res: any = await userApi.googleLogin({
      id_token: tokenId,
    })

    const { user, token } = res
    localStorage.setItem('access_token', token)
    setUser(user)
    setError(null)
  }

  const responseFailure = async (response: any) => {
    localStorage.clear()
    setUser(null)
    setError('Can not login.')
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
