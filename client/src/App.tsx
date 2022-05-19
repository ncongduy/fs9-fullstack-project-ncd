import { Routes, Route } from 'react-router-dom'
import GoogleLogin from 'react-google-login'

import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import axios from 'axios'

function App() {
  const responseGoogle = async (response: any) => {
    console.log(response)
    const tokenId = response?.tokenId
    const res = await axios.post('/users/google-login', {
      id_token: tokenId,
    })

    const { user, token } = res.data
    localStorage.setItem('access_token', token)
  }

  axios.get('/bookloans')

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
