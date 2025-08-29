import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';

// Components
const StatCard = ({ label, value, color }) => (
  <div className="glass p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`text-sm font-medium ${color} mb-1`}>{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      
    </div>
    <div className="mt-4 pt-3 border-t border-gray-100" style={{borderColor: '#e0e6ed'}}>
      <p className="text-xs" style={{color: '#23242b'}}>Updated just now</p>
    </div>
  </div>
);

const JobCard = ({ job, type, onSave, onApply }) => {
  const statusColors = {
    Applied: 'bg-blue-100 text-blue-800 rounded-lg px-2',
    Interview: 'bg-amber-100 text-amber-800 rounded-lg px-2',
    Rejected: 'bg-red-100 text-red-800 rounded-lg px-2',
    Offer: 'bg-green-100 text-green-800 rounded-lg px-2'
  };

  return (
    <div className="glass p-5 rounded-xl hover:shadow-md transition-all duration-300" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-semibold mb-1" style={{color: '#23242b'}}>{job.title}</h4>
          <p className="text-sm mb-2" style={{color: '#23242b'}}>{job.company} {job.location && `• ${job.location}`}</p>
          
          {type === 'recent' ? (
            <div className="flex items-center justify-between mt-3">
              <span className={`status-badge ${statusColors[job.status]}`}>
                {job.status}
              </span>
              <span className="text-xs" style={{color: '#23242b'}}>{job.date}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center text-sm mb-3" style={{color: '#23242b'}}>
                <i className="fas fa-map-marker-alt mr-2"></i>
                {job.location}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{color: '#23242b'}}>{job.salary}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onSave(job)}
                    className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50"
                    aria-label="Save job"
                  >
                    <i className="far fa-bookmark"></i>
                  </button>
                  <button 
                    onClick={() => onApply(job)}
                    className="px-3 py-1 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    jobTitle: 'Frontend Developer',
    profileCompletion: 85
  });

  const [stats, setStats] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on component mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats([
        { label: 'Jobs Applied', value: 24, color: 'text-blue-800' },
        { label: 'Interviews', value: 8,  color: 'text-amber-800' },
        { label: 'Saved Jobs', value: 17,  color: 'text-green-800' },
        { label: 'ATS Score', value: 85,  color: 'text-purple-800' },
      ]);

      setRecentJobs([
        { id: 1, title: 'Senior React Developer', company: 'TechCorp', date: '2 days ago', status: 'Applied' },
        { id: 2, title: 'UX Designer', company: 'DesignHub', date: '5 days ago', status: 'Interview' },
        { id: 3, title: 'Full Stack Developer', company: 'WebSolutions', date: '1 week ago', status: 'Rejected' },
        { id: 4, title: 'Product Manager', company: 'InnovateCo', date: '2 weeks ago', status: 'Offer' },
      ]);

      setRecommendedJobs([
        { id: 5, title: 'Frontend Engineer', company: 'TechStart', location: 'San Francisco, CA', salary: '$120k - $140k' },
        { id: 6, title: 'UI Developer', company: 'DesignWorks', location: 'Remote', salary: '$100k - $130k' },
        { id: 7, title: 'JavaScript Developer', company: 'CodeMasters', location: 'New York, NY', salary: '$110k - $135k' },
      ]);
    }, 500);
  }, []);

  const handleLogout = useCallback(() => {
    // Logout logic would go here
    alert('Logging out...');
  }, []);

  const handleSaveJob = useCallback((job) => {
    alert(`Saving job: ${job.title}`);
    // Actual save logic would go here
  }, []);

  const handleApplyJob = useCallback((job) => {
    alert(`Applying to: ${job.title}`);
    // Actual apply logic would go here
  }, []);

  const filteredRecommendedJobs = recommendedJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar*/}
      <div className="w-64 glass shadow-md" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
        <div className="p-6 glass" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
          <h1 className="text-2xl font-bold text-blue-600">JobSeek</h1>
        </div>
        <nav className="mt-6">
          <Link to="/dashboard" 
            className={`flex items-center cursor-pointer px-6 py-3 ${activeTab === 'Dashboard' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            onClick={() => setActiveTab('Dashboard')}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="mx-4 font-medium">Dashboard</span>
          </Link>
          
          <Link to="/profile" 
            className={`flex items-center cursor-pointer px-6 py-3 ${activeTab === 'Profile' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            onClick={() => setActiveTab('Profile')}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <span className="mx-4 font-medium">Profile</span>
          </Link>
          
          <Link to="/savedjobs" 
            className={`flex items-center cursor-pointer px-6 py-3 ${activeTab === 'Saved Jobs' ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
            onClick={() => setActiveTab('Saved Jobs')}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            <span className="mx-4 font-medium">Saved Jobs</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto rounded-lg">
        {/* Header */}
  <header className="flex items-center justify-between p-5 glass shadow-sm" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
          <h2 className="text-xl font-semibold" style={{color: '#23242b'}}>{activeTab}</h2>
          <div className="flex items-center ">
          
            <div className="flex items-center ">
              <div className="mr-2  text-right">
                <p className="text-sm font-medium" style={{color: '#23242b'}}>{user.name}</p>
                <p className="text-xs" style={{color: '#23242b'}}>{user.jobTitle}</p>
              </div>
              <div className="relative">
                <img className="w-10 h-10 rounded-full" src={user.avatar} alt="User avatar" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              <div className='pl-4'>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  Logout
                </button>
              </div>

            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-2">
          {/* Welcome Banner */}
          <div className="glass rounded-xl p-6 mb-8" style={{background: 'linear-gradient(90deg, #e3f0ff 0%, #f6f8fa 100%, rgba(255,255,255,0.85))', color: '#23242b'}}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                
              </div>
              
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard 
                key={index} 
                label={stat.label} 
                value={stat.value} 
                icon={stat.icon}
                color={stat.color}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Applications */}
            <div className="glass p-6 rounded-xl shadow-sm" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold" style={{color: '#23242b'}}>Recent Applications</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    type="recent" 
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                  />
                ))}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="glass p-6 rounded-xl shadow-sm" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold" style={{color: '#23242b'}}>Recommended For You</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {filteredRecommendedJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    type="recommended" 
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;