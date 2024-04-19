import {useState, useEffect, useCallback} from 'react'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import {RiStarFill} from 'react-icons/ri'
import {MdPlace} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const Job = () => {
  const [activeEmploymentTypeIds, setActiveEmploymentTypeIds] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [jobData, setJobData] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [jobsApiUrlStatus, setJobsApiUrlStatus] = useState(null)
  const [activeasalaryRangeIds, setSalaryRangeIds] = useState('')
  const [profileDetailsApiStatus, setProfileDetailsApiStatus] = useState(null)
  const [profileDetails, setProfileDetails] = useState('')
  const jwtToken = Cookies.get('jwt_token')

  const searchInputChanged = event => {
    setSearchInput(event.target.value)
  }

  const fetchProfileDetails = useCallback(async () => {
    try {
      const profileApiUrl = 'https://apis.ccbp.in/profile'
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(profileApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const formattedData = {
          name: data.profile_details.name,
          profileImageUrl: data.profile_details.profile_image_url,
          shortBio: data.profile_details.short_bio,
        }
        setProfileDetails(formattedData)
        setProfileDetailsApiStatus(true)
      } else {
        setProfileDetailsApiStatus(false)
      }
    } catch (error) {
      console.error('Error fetching profile details:', error)
      setProfileDetailsApiStatus(false)
    }
  }, [jwtToken])

  const returnProfileDetailsJsxSuccess = () => {
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-details-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="name-heading">{name}</h1>
        <p className="bio-para">{shortBio}</p>
      </div>
    )
  }

  const retryProfileDetails = () => fetchProfileDetails()

  const returnProfileDetailsJsxFailed = () => (
    <div className="retry-button-in-profile-failed-container">
      <button
        type="button"
        className="retry-button-in-profile-failed"
        onClick={retryProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  const renderJobData = () => (
    <div className="all-jobs-items-container">
      {jobData.map(eachJob => (
        <Link
          className="job-item-container"
          key={eachJob.id}
          to={`/jobs/${eachJob.id}`}
        >
          <div className="logo-job-title-rating-container">
            <img
              src={eachJob.companyLogoUrl}
              alt="company logo"
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
          <div className="location-jobtype-ctc-container">
            <div className="location-container">
              <MdPlace size="30" />
              <p className="location-para">{eachJob.location}</p>
            </div>
            <div className="jobtype-container">
              <BsBriefcaseFill size="30" />
              <p className="jobtype-para">{eachJob.employmentType}</p>
            </div>
            <p className="ctc-para">{eachJob.packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div>
            <h2 className="description-heading">Description</h2>
            <p className="jobdescription-para">{eachJob.jobDescription}</p>
          </div>
        </Link>
      ))}
    </div>
  )

  const renderJobSearchFilterFail = () => (
    <div className="job-filters-failed">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-img"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true)
      const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentTypeIds.join(
        ',',
      )}&minimum_package=${activeasalaryRangeIds}&search=${searchInput}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }
      const response = await fetch(jobsApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const formattedJobData = data.jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        }))
        setJobData(formattedJobData)
        setJobsApiUrlStatus(true)
      } else {
        setJobsApiUrlStatus(false)
      }
    } catch (error) {
      console.error('Error fetching job details:', error)
      setJobsApiUrlStatus(false)
    } finally {
      setLoading(false)
    }
  }, [activeEmploymentTypeIds, activeasalaryRangeIds, jwtToken, searchInput])

  const filterIconClicked = () => fetchJobDetails()

  const alljobsDataSuccess = () => {
    const bool = jobData.length > 0
    return <div>{bool ? renderJobData() : renderJobSearchFilterFail()}</div>
  }

  const alljobsDataFailure = () => (
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

      <button
        type="button"
        className="retry-button-in-jobspage-failed"
        onClick={filterIconClicked}
      >
        Retry
      </button>
    </div>
  )

  const employementIdsFilterChanges = event => {
    const {checked, id} = event.target
    // Update activeEmploymentTypeIds based on checkbox state
    if (checked) {
      setActiveEmploymentTypeIds([...activeEmploymentTypeIds, id]) // Add ID if checked
    } else {
      setActiveEmploymentTypeIds(
        activeEmploymentTypeIds.filter(id1 => id1 !== id),
      ) // Remove ID if unchecked
    }
  }

  const salaryRangeFilterChanges = event => {
    const {checked, id} = event.target

    // Update activeEmploymentTypeIds based on checkbox state
    if (checked) {
      setSalaryRangeIds(id) // Add ID if checked
    }
  }

  const returnSalaryFilters = () => (
    <div className="salary-range-filter-container">
      <h1 className="salary-range-filter-heading">Salary Range</h1>
      <ul className="unordered-list-container">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId} className="list-item">
            <button type="button" className="button-item">
              <input
                type="radio"
                id={each.salaryRangeId}
                name="salary"
                value={each.label}
                onChange={salaryRangeFilterChanges}
                className="checkbox-filter"
              />
              <label htmlFor={each.salaryRangeId} className="label-filter">
                {each.label}
              </label>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  const returnEmploymentFilters = () => (
    <div className="types-of-employement-filter-container">
      <h1 className="types-of-employement-heading">Types of Employement</h1>
      <ul className="unordered-list-container">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId} className="list-item">
            <button type="button" className="button-item">
              <input
                type="checkbox"
                id={each.employmentTypeId}
                onChange={employementIdsFilterChanges}
                name="employement_type"
                className="checkbox-filter"
              />
              <label htmlFor={each.employmentTypeId} className="label-filter">
                {each.label}
              </label>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  const returnSmSearchContainer = () => (
    <div className="search-container-sm">
      <input
        type="search"
        className="search-input-sm"
        placeholder="Search"
        id="searchbarsm"
        value={searchInput}
        onChange={searchInputChanged}
      />
      <button
        type="button"
        data-testid="searchButton"
        aria-label="search icons"
        className="search-icon-button-sm"
      >
        <BsSearch className="search-icon-sm" />
      </button>
    </div>
  )

  const returnLgSearchContainer = () => (
    <div className="search-container-lg">
      <input
        type="search"
        className="search-input-lg"
        placeholder="Search"
        id="searchbarlg"
        value={searchInput}
        onChange={searchInputChanged}
      />
      <button
        type="button"
        data-testid="searchButton"
        aria-label="search icons"
        className="search-icon-button-lg"
      >
        <BsSearch className="search-icon-lg" />
      </button>
    </div>
  )

  const isLoadingDots = () => (
    <div className="jobs-container">
      <Header />
      <div className="jobs-container-2">
        <div className="left-side-container">
          {returnSmSearchContainer()}
          <div>
            {profileDetailsApiStatus
              ? returnProfileDetailsJsxSuccess()
              : returnProfileDetailsJsxFailed()}
          </div>
          <hr />
          {returnEmploymentFilters()}
          <hr />
          {returnSalaryFilters()}
        </div>
        <div className="right-side-container">
          {returnLgSearchContainer()}
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        </div>
      </div>
    </div>
  )

  const loadJobData = () => (
    <div className="jobs-container">
      <Header />
      <div className="jobs-container-2">
        <div className="left-side-container">
          {returnSmSearchContainer()}
          <div>
            {profileDetailsApiStatus
              ? returnProfileDetailsJsxSuccess()
              : returnProfileDetailsJsxFailed()}
          </div>
          <hr />
          {returnEmploymentFilters()}
          <hr />
          {returnSalaryFilters()}
        </div>
        <div className="right-side-container">
          {returnLgSearchContainer()}
          <div className="all-jobs">
            {jobsApiUrlStatus ? alljobsDataSuccess() : alljobsDataFailure()}
          </div>
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    fetchProfileDetails()
    fetchJobDetails()
  }, [fetchProfileDetails, fetchJobDetails])

  return <div>{isLoading ? isLoadingDots() : loadJobData()}</div>
}

export default Job
