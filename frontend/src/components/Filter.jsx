import React from 'react';

const Filter = () => {
    return (
    <div className='glass min-w-[300px] p-4 rounded-lg h-[500px] overflow-y-auto' style={{background: 'rgba(30,32,40,0.65)', color: '#f3f4f8', border: '1.5px solid rgba(255,255,255,0.13)'}}>
            <h2 className='text-xl font-bold mb-4'>Filters</h2>

            {/* Category Section */}
            <div className='mb-6'>
                <h3 className='font-semibold mb-2'>Category</h3>
                <label className='flex items-center mb-1'>
                    <input type='checkbox' className='mr-2' /> Frontend
                </label>
                <label className='flex items-center mb-1'>
                    <input type='checkbox' className='mr-2' /> Backend
                </label>
                <label className='flex items-center mb-1'>
                    <input type='checkbox' className='mr-2' /> Fullstack
                </label>
            </div>

            {/* Job Type Section */}
            <div className='mb-6'>
                <h3 className='font-semibold mb-2'>Job Type</h3>
                <label className='flex items-center mb-1'>
                    <input type='radio' name='jobType' className='mr-2' /> Full-time
                </label>
                <label className='flex items-center mb-1'>
                    <input type='radio' name='jobType' className='mr-2' /> Part-time
                </label>
                <label className='flex items-center mb-1'>
                    <input type='radio' name='jobType' className='mr-2' /> Internship
                </label>
            </div>

            {/* Salary Range Section */}
            <div className='mb-6'>
                <h3 className='font-semibold mb-2'>Salary Range</h3>
                <input type='range' min='30000' max='200000' step='1000' className='w-full' />
                <p className='text-sm mt-1'>Up to ₹100000</p>
            </div>
        </div>
    );
};

export default Filter;
