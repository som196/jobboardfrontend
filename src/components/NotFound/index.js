import './index.css'

const NotFound = () => {
  const notFoundImg =
    'https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png'

  return (
    <div className="not-found-container">
      <img src={notFoundImg} alt="not found" className="not-found-img" />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-para">
        We are sorry, the page you have requested could not be found
      </p>
    </div>
  )
}

export default NotFound
