import React from 'react'







const Footer = () => {
  return (
  <footer className="glass text-white mt-12" style={{color: '#f3f4f8', background: 'rgba(30,32,40,0.65)', border: '1.5px solid rgba(255,255,255,0.13)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)', borderRadius: 0}}>
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold gradient-text mb-4" style={{color: '#4f8cff'}}>JobSeek</h2>
            <p className="mb-6 text-lg" style={{color: '#bfc9d1'}}>
              Connecting talented professionals with their dream careers.
              Find the perfect job that matches your skills and aspirations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors" style={{color: '#bfc9d1'}}>
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{color: '#bfc9d1'}}>
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{color: '#bfc9d1'}}>
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{color: '#bfc9d1'}}>
                <i className="fab fa-instagram text-xl"></i>
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative pb-2">
              For Job Seekers
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-green-500"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-search mr-2 text-sm"></i> Browse Jobs</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-book-open mr-2 text-sm"></i> Career Advice</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-file-alt mr-2 text-sm"></i> Resume Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-chart-line mr-2 text-sm"></i> Salary Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-comments mr-2 text-sm"></i> Interview Tips</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-xl font-semibold mb-6 relative pb-2">
              For Employers
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-blue-500"></span>
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-briefcase mr-2 text-sm"></i> Post a Job</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-user-tie mr-2 text-sm"></i> Browse Resumes</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-handshake mr-2 text-sm"></i> Recruiting Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-toolbox mr-2 text-sm"></i> Employer Resources</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center" style={{color: '#bfc9d1'}}><i className="fas fa-tag mr-2 text-sm"></i> Pricing</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Contact and Bottom Bar */}
  <div className="border-t border-gray-800" style={{borderColor: 'rgba(255,255,255,0.13)'}}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2" style={{color: '#bfc9d1'}}>
                <i className="fas fa-envelope"></i>
                <span>contact@jobseek.com</span>
              </div>
              <div className="flex items-center space-x-2 mt-2" style={{color: '#bfc9d1'}}>
                <i className="fas fa-phone"></i>
                <span>(555) 123-4567</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm" style={{color: '#bfc9d1'}}>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm" style={{color: '#bfc9d1'}}>
            <p>&copy; {new Date().getFullYear()} JobSeek. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer