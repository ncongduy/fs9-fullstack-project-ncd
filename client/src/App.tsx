import { Routes, Route } from 'react-router-dom'
import GoogleLogin from 'react-google-login'

import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import axiosClient from './fetchApi/axiosClient'

type ResTypes = {
  token: string
  user: {
    firstName: string
    lastName: string
    email: string
    role: string
    updateAt: Date
    createAt: Date
  }
}

function App() {
  const responseGoogle = async (response: any) => {
    const tokenId = response?.tokenId
    const res: ResTypes = await axiosClient.post('/users/google-login', {
      id_token: tokenId,
    })

    const { user, token } = res
    localStorage.setItem('access_token', token)
  }

  return (
    <>
      <GoogleLogin
        clientId="628027389160-6mlqifinuua7mrgeml4qa0g9g4j2sbe2.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={'single_host_origin'}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  )
}

export default App
