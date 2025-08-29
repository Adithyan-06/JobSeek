
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import heroImg from '../assets/heroimg.png'


const Home = () => {
  const textRef = useRef(null);
  const statsRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    // Trigger animation on mount
    if (textRef.current) textRef.current.classList.add('slide-in-left');
    if (statsRef.current) statsRef.current.classList.add('slide-in-left');
    if (imgRef.current) imgRef.current.classList.add('slide-in-right');
  }, []);

  return (
  <div className="pt-16 min-h-screen" style={{background: '#f6f8fa'}}>
      <style>{`
        @keyframes slideInLeftBlur {
          0% { opacity: 0; transform: translateX(-80px); filter: blur(18px); }
          60% { filter: blur(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @keyframes slideInRightBlur {
          0% { opacity: 0; transform: translateX(80px); filter: blur(18px); }
          60% { filter: blur(0); }
          100% { opacity: 1; transform: translateX(0); filter: blur(0); }
        }
        @media (max-width: 1024px) {
          .slide-in-right { animation: slideInRightBlur 1.8s cubic-bezier(.6,.2,.2,1) both !important; }
          .slide-in-left { animation: slideInLeftBlur 1.8s cubic-bezier(.6,.2,.2,1) both !important; }
        }
        @media (max-width: 768px) {
          @keyframes slideInRightBlurMobile {
            0% { opacity: 0; transform: translateY(80px); filter: blur(18px); }
            60% { filter: blur(0); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes slideInLeftBlurMobile {
            0% { opacity: 0; transform: translateY(-80px); filter: blur(18px); }
            60% { filter: blur(0); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .slide-in-right { animation: slideInRightBlurMobile 1.8s cubic-bezier(.6,.2,.2,1) both !important; }
          .slide-in-left { animation: slideInLeftBlurMobile 1.8s cubic-bezier(.6,.2,.2,1) both !important; }
        }
        .slide-in-left { animation: slideInLeftBlur 1.8s cubic-bezier(.6,.2,.2,1) both; }
        .slide-in-right { animation: slideInRightBlur 1.8s cubic-bezier(.6,.2,.2,1) both; }
      `}</style>
      {/*Landing */}
      <section className="max-w-screen-2xl w-full h-full m-auto px-6 lg:flex">
        {/* Left */}
        <div className="lg:pt-40 pt-20 flex-1">
          {/*Text box */}
          <div ref={textRef}>
            <h2 className="text-4xl md:text-6xl font-bold" style={{color: '#23242b'}}>Find Your Dream Job with <span style={{color: '#4f8cff'}}>AI-Powered</span> Recommendations</h2>
              <p className="text-lg sm:text-xl pt-8" style={{color: '#23242b'}}>Discover thousands of job opportunities tailored to your skills and preferences. Let our intelligent matching system connect you with the perfect career opportunities.</p>
          </div>

          {/*Stats */}
          <div ref={statsRef} className="glass p-4 flex sm:gap-8 gap-4 rounded-lg shadow-md mt-8 w-fit" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
            <div>
              <h2 className="font-bold text-3xl" style={{color: '#4f8cff'}}>50K+</h2>
              <p className="text-sm" style={{color: '#23242b'}}>Active Jobs</p>
            </div>
            <div className="border-x-4 sm:px-7 px-4" style={{borderColor: '#4f8cff'}}>
              <h2 className="font-bold text-3xl" style={{color: '#4f8cff'}}>21K+</h2>
              <p className="text-sm" style={{color: '#23242b'}}>Happy Users</p>
            </div>
            <div>
              <h2 className="font-bold text-3xl" style={{color: '#4f8cff'}}>500+</h2>
              <p className="text-sm" style={{color: '#23242b'}}>Companies</p>
            </div>
          </div>

          {/* Buttons CTA*/}
          <div className="mt-8 flex gap-4">
            <Link className="sm:px-10 px-5 sm:text-md text-sm py-4 glass rounded-lg capitalize cursor-pointer font-bold" style={{background: 'rgba(255,255,255,0.85)', color: '#4f8cff', border: '1.5px solid #4f8cff'}} to={'/signup'}>Get Started for free <i className="fa fa-arrow-right pl-3" style={{color: '#4f8cff'}}></i> </Link>
            <Link className="glass font-bold cursor-pointer sm:px-6 sm:text-md text-sm px-5 rounded-lg py-4" style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}} to={'/login'}>Sign In</Link>
          </div>
        </div>

        {/*Right */}
        <div className="lg:min-w-190 lg:flex lg:h-full justify-center lg:mt-50 mb-10">
          <img ref={imgRef} src={heroImg} alt="Hero Image" className="lg:w-150 md:h-100 mt-6 lg:rotate-3 rounded-xl border border-[#35363c] shadow-2xl" />
        </div>
      </section>
    </div>
  );
};

export default Home;
