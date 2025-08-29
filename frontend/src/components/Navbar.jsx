






import { Link } from "react-router";

const Navbar = () => {
  return (
  <nav className="glass h-18 flex items-center shadow-lg border-b-2 border-gray-200 fixed w-full z-100 backdrop-blur-lg" style={{backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', borderRadius: 0, background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
      {/* Expanded but centered container */}
      <div className="max-w-screen-2xl w-full mx-auto px-6 flex justify-between items-center h-full">
        {/*Logo And Name */}
        <div>
          <h2 className="text-xl font-bold" style={{color: '#4f8cff'}}>JobSeek</h2>
        </div>

        {/*NavLinks */}
        <div className="hidden md:flex justify-between gap-8">
          <Link to={'/'} style={{color: '#23242b'}}>Home</Link>
          <Link to={'/search'} style={{color: '#23242b'}}>Jobs</Link>
          <Link to={'/dashboard'} style={{color: '#23242b'}}>Dashboard</Link>
          <Link to={'/admin'} style={{color: '#23242b'}}>Admin</Link>
        </div>

        {/*Navbuttons*/}
        <div>
          <div className="flex justify-between gap-4 items-center">
            <i className="fa-regular fa-bell text-lg" style={{color: '#23242b'}}></i>
            <Link className="bg-blue-500 py-2 px-4 rounded-lg text-white" to={'/login'}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

