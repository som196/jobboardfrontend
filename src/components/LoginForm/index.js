import {useState} from 'react'
import Cookies from 'js-cookie'
import './index.css'

const LoginForm = props => {
  const websitelogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [error, setError] = useState('')
  const {history} = props

  const userNameChanged = event => {
    setUserName(event.target.value)
  }
  const passwordChanged = event => {
    setPassword(event.target.value)
  }
  const onSubmitSuccess = jwtToken => {
    if (history) {
      Cookies.set('jwt_token', jwtToken, {
        expires: 30,
        path: '/',
      })
      history.replace('/')
    }
  }

  const onSubmitFailure = error1 => {
    setShowError(true)
    setError(error1)
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      onSubmitFailure(data.error_msg)
    }
  }

  return (
    <div className="main-container">
      <div className="logo-input-container">
        <div className="img-container">
          <img src={websitelogo} alt="website logo" className="website-logo" />
        </div>

        <form className="inputs-container" onSubmit={submitForm}>
          <label htmlFor="user" className="username-label">
            USERNAME
          </label>
          <input
            type="text"
            id="user"
            value={username}
            onChange={userNameChanged}
            placeholder="Username"
            className="text-input"
          />

          <label htmlFor="password" className="password-label">
            PASSWORD
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={passwordChanged}
            className="password-input"
            placeholder="Password"
          />

          <div className="button-container">
            <button type="submit" className="login-button">
              Login
            </button>
            {showError && <p className="error-message">*{error}</p>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
