import React from 'react'

const Listings = () => {
    return (
        <div className='flex-1 p-4 rounded-lg'>
            {/*Headers*/}
            <div className='flex justify-between'>
                <h2 className='text-2xl font-bold'>0 Jobs found</h2>
                <select className='border border-gray-300 py-3 px-6 rounded-xl'>
                    <option>Most Relevant</option>
                </select>
            </div>

            {/* Job Results */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-6'>
                {/* JobCard 1*/}
                <div className='glass p-6 rounded-lg' style={{background: 'rgba(255,255,255,0.85)', color: '#23242b', border: '1.5px solid #e0e6ed'}}>
                    <div className='card-headers flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <img src="" alt="" className='bg-blue-500 h-14 w-14 rounded-xl border-gray-100' />
                            <div className=''>
                                <h2 className='capitalize text-xl font-bold'>Senior frontend developer</h2>
                                <p>TechFlow Inc</p>
                            </div>
                        </div>
                        <i>icon</i>
                    </div>

                    <div className='job-info pt-4 space-y-4 text-gray-500 text-lg'>
                        <p>Austin</p>
                        <p>Fulltime</p>
                        <p className='text-green-600 font-bold'>$85k - 100k$</p>
                    </div>

                    <div className='description pt-3'>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate officia magni asperiores, incidunt, aspernatur necessitatibus tenetur iusto odit error nostrum praesentium laudantium sunt ratione voluptatibus culpa totam. Omnis, deserunt eos.
                        </p>
                    </div>

                    <div className='jobskills pt-5 space-x-3'>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>React</span>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>Javascript</span>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>Nodejs</span>
                    </div>

                    <div className='cardfooter pt-6 flex items-center justify-between'>
                        <p className='text-gray-500'>3days ago</p>
                        <button className='bg-blue-500 py-3 rounded-xl text-white text-lg font-bold px-6'>Apply Now</button>
                    </div>
                </div>

                {/* JobCard 2*/}
                <div className='glass p-6 rounded-lg'>
                    <div className='card-headers flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <img src="" alt="" className='bg-blue-500 h-14 w-14 rounded-xl border-gray-100' />
                            <div className=''>
                                <h2 className='capitalize text-xl font-bold'>Senior frontend developer</h2>
                                <p>TechFlow Inc</p>
                            </div>
                        </div>
                        <i>icon</i>
                    </div>

                    <div className='job-info pt-4 space-y-4 text-gray-500 text-lg'>
                        <p>Austin</p>
                        <p>Fulltime</p>
                        <p className='text-green-600 font-bold'>$85k - 100k$</p>
                    </div>

                    <div className='description pt-3'>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate officia magni asperiores, incidunt, aspernatur necessitatibus tenetur iusto odit error nostrum praesentium laudantium sunt ratione voluptatibus culpa totam. Omnis, deserunt eos.
                        </p>
                    </div>

                    <div className='jobskills pt-5 space-x-3'>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>React</span>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>Javascript</span>
                        <span className='bg-blue-300/40 py-2 rounded-xl border border-gray-200 text-blue-500 font-bold px-4'>Nodejs</span>
                    </div>

                    <div className='cardfooter pt-6 flex items-center justify-between'>
                        <p className='text-gray-500'>3days ago</p>
                        <button className='bg-blue-500 py-3 rounded-xl text-white text-lg font-bold px-6'>Apply Now</button>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Listings