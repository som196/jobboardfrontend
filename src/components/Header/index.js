import {Link, withRouter} from 'react-router-dom'
import {MdHome} from 'react-icons/md'
import {FiLogOut} from 'react-icons/fi'
import {BsBriefcaseFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const websitelogo = 'https://assets.ccbp.in/frontend/react-js/logo-img.png'
  const logoutButtonClicked = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="header-container-lg header-container-sm">
      <Link to="/">
        <img
          src={websitelogo}
          alt="website logo"
          className="website-logo-lg website-logo-sm"
        />
      </Link>
      <div className="home-logout-container">
        <Link to="/">
          <p className="home-para-lg">Home</p>
          <MdHome size="40" className="home-icon" />
        </Link>
        <Link to="/jobs">
          <p className="jobs-para-lg">Jobs</p>
          <BsBriefcaseFill size="35" className="bag-icon" />
        </Link>
      </div>
      <div>
        <button
          type="button"
          className="logout-button-lg"
          onClick={logoutButtonClicked}
        >
          Logout
        </button>
        <button
          type="button"
          className="logout-button-sm"
          aria-label="logout"
          onClick={logoutButtonClicked}
        >
          <FiLogOut size="30" />
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
