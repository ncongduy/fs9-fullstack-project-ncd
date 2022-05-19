import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'

axios.interceptors.request.use((request) => {
  const token = localStorage.getItem('access_token')

  if (token) {
    request.headers = {
      Authorization: `Bearer ${token}`,
    }
  }

  return request
})

axios.defaults.baseURL = 'http://localhost:5000/api/v1'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
