import {Link} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {RiStarFill} from 'react-icons/ri'
import {MdPlace} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const JobItemDetails = props => {
  const {match} = props
  const {params} = match
  const {id} = params
  const [jobData, setJobData] = useState([])
  const [jobsApiUrlStatus, setJobsApiUrlStatus] = useState(null)
  const [similarJobsDetails, setSimilarJobsDetails] = useState([])
  const [Loading, setLoading] = useState(false)
  const jwtToken = Cookies.get('jwt_token')

  const renderJobDetailsSuccess = () => {
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeatcompanyDescription,
      lifeatcompanyImageUrl,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData[0]
    return (
      <div className="background-container-job-details">
        <div className="logo-job-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="title-rating-contianer">
            <h1 className="job-title">{title}</h1>
            <div className="rating-container">
              <RiStarFill size="20" />
              <p className="rating-para">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-jobtype-ctc-container">
          <div className="location-container">
            <MdPlace size="30" />
            <p className="location-para">{location}</p>
          </div>
          <div className="jobtype-container">
            <BsBriefcaseFill size="30" />
            <p className="jobtype-para">{employmentType}</p>
          </div>
          <p className="ctc-para">{packagePerAnnum}</p>
        </div>
        <hr className="horizontal-line" />
        <div className="description-company-url-contianer">
          <h2 className="description-heading">Description</h2>
          <div className="anchor-icon-container">
            <a
              href={companyWebsiteUrl}
              className="company-url"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
              <BsBoxArrowUpRight
                size="17"
                fill="#6366f1"
                className="bs-arrowupright"
              />
            </a>
          </div>
        </div>
        <p className="jobdescription-para">{jobDescription}</p>

        <div className="skills-heading-skills-container">
          <h1 className="skills-heading">Skills</h1>
          <div className="all-skills-list-container">
            {skills.map(eachSkill => (
              <div className="each-skill-container" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  className="skill-img"
                  alt={eachSkill.name}
                />
                <h1 className="skill-name-heading">{eachSkill.name}</h1>
              </div>
            ))}
          </div>
        </div>

        <div className="life-at-company-container">
          <div className="life-heading-description-container">
            <h1 className="life-heading">Life at Company</h1>
            <p className="life-description">{lifeatcompanyDescription}</p>
          </div>
          <img
            src={lifeatcompanyImageUrl}
            alt="life at company"
            className="life-at-company-img"
          />
        </div>
      </div>
    )
  }

  const renderSimilarJobDetailsSuccess = () => (
    <div className="similar-jobs-container">
      <h1 className="similar-jobs-heading">Similar Jobs</h1>
      <div className="all-similar-jobs-container">
        {similarJobsDetails.map(eachJob => (
          <Link
            className="similar-job-container"
            key={eachJob.id}
            to={`/jobs/${eachJob.id}`}
          >
            <div className="logo-job-title-rating-container">
              <img
                src={eachJob.companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div className="title-rating-contianer">
                <h1 className="job-title">{eachJob.title}</h1>
                <div className="rating-container">
                  <RiStarFill size="20" />
                  <p className="rating-para">{eachJob.rating}</p>
                </div>
              </div>
            </div>
            <div className="description-company-url-contianer">
              <h2 className="description-heading">Description</h2>
            </div>
            <p className="jobdescription-para">{eachJob.jobDescription}</p>
            <div className="location-jobtype-ctc-container">
              <div className="location-container">
                <MdPlace size="30" />
                <p className="location-para">{eachJob.location}</p>
              </div>
              <div className="jobtype-container">
                <BsBriefcaseFill size="30" />
                <p className="jobtype-para">{eachJob.employmentType}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  const renderJobDetailsFailure = () => (
    <div className="jobspage-failed-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button-in-jobspage-failed">
        Retry
      </button>
    </div>
  )

  const isLoadingDots = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true)
      const jobSpecificUrl = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(jobSpecificUrl, options)
      if (response.ok) {
        const data = await response.json()
        const jobDetails = data.job_details
        const convertedtodata = Array(jobDetails)
        const formattedJobsData = convertedtodata.map(each => ({
          companyLogoUrl: each.company_logo_url,
          title: each.title,
          companyWebsiteUrl: each.company_website_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          skills: each.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          lifeatcompanyDescription: each.life_at_company.description,
          lifeatcompanyImageUrl: each.life_at_company.image_url,
        }))

        const formattedSimilarJobsData = data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))

        setJobData(formattedJobsData)
        setSimilarJobsDetails(formattedSimilarJobsData)
        setJobsApiUrlStatus(true)
      } else {
        setJobsApiUrlStatus(false)
      }
      setLoading(false)
    }
    fetchJobDetails()
  }, [id, jwtToken])

  return (
    <div>
      {Loading ? ( // Incorrect indentation here
        <div className="main-container-in-jobitem-details">
          <Header />
          {isLoadingDots()}
        </div>
      ) : (
        // Incorrect indentation here
        <div className="main-container-in-jobitem-details">
          <Header />
          <div className="job-details-container">
            {jobsApiUrlStatus
              ? renderJobDetailsSuccess()
              : renderJobDetailsFailure()}
          </div>
          <div>
            {jobsApiUrlStatus
              ? renderSimilarJobDetailsSuccess()
              : renderJobDetailsFailure()}
          </div>
        </div>
      )}
    </div>
  )
}

export default JobItemDetails
