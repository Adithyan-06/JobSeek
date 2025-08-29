import Filter from '../components/Filter'

import Listings from '../components/Listings'

const Search = () => {
    return (
        <div className='pt-18'>
            <section style={{background: '#f6f8fa'}}>
                <div className="max-w-screen-2xl w-full mx-auto px-6 flex flex-col items-center justify-center min-h-90">
                    {/* TextBox */}
                    <div className='text-center pb-6'>
                        <h2 className="capitalize text-4xl font-bold pb-3" style={{color: '#23242b'}}>Find your dream job</h2>
                        <p className='text-lg' style={{color: '#23242b'}}>Discover opportunities that match your skills and aspirations</p>
                    </div>

                    {/*SearchBar*/}
                    <div className='glass min-h-16 w-fit flex items-center p-6 rounded-xl shadow-xl gap-4' style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
                        <div className='flex gap-4'>
                            <input type="text" className='p-4 rounded-lg' style={{background: '#fff', color: '#23242b', border: '1px solid #e0e6ed'}} placeholder='Job title, keywords or company name' />
                            <input type="text" className='p-4 rounded-lg' style={{background: '#fff', color: '#23242b', border: '1px solid #e0e6ed'}} placeholder='Location' />
                        </div>
                        <button className='p-4 bg-blue-500 text-white rounded-lg cursor-pointer'>Search Jobs</button>
                    </div>
                </div>
            </section>

            {/* JobListing and filters */}
            <section style={{background: '#f6f8fa'}}>
                <div className="max-w-screen-2xl w-full mx-auto px-6 flex gap-3 pt-6">
                    <Filter />
                    <Listings />
                </div>
            </section>
        </div>
    )
}

export default Search