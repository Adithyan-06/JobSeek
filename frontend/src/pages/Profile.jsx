import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({ name: '', avatar: '', jobTitle: '' });
    
    // Initial state with guaranteed empty values to prevent crashes on first render
    const initialProfileState = {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        desired_roles: [],
        preferred_locations: [],
        resume_url: '',
        linkedin_url: '',
        profile_picture_url: '',
        skills: [],
        education_history: [],
        work_experience: []
    };

    const [profileData, setProfileData] = useState(initialProfileState);
    const [editData, setEditData] = useState(initialProfileState);
    
    const [newSkill, setNewSkill] = useState('');
    const [newDesiredRole, setNewDesiredRole] = useState('');
    const [newPreferredLocation, setNewPreferredLocation] = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('Profile');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user profile data
    const fetchProfile = useCallback(async () => {
        try {
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
            if (authError || !authUser) {
                console.error('User not authenticated.');
                setLoading(false);
                return;
            }

            // Fetch profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();
            if (profileError && profileError.code !== 'PGRST116') throw profileError; // Ignore "no rows found" error

            // Fetch education history
            const { data: education, error: educationError } = await supabase
                .from('education_history')
                .select('*')
                .eq('user_id', authUser.id)
                .order('start_date', { ascending: false });
            if (educationError) throw educationError;

            // Fetch work experience
            const { data: work, error: workError } = await supabase
                .from('work_experience')
                .select('*')
                .eq('user_id', authUser.id)
                .order('start_date', { ascending: false });
            if (workError) throw workError;

            const safeProfile = profile || {};

            // Set profile data with fallbacks for every field
            const loadedProfileData = {
                ...safeProfile,
                email: authUser.email,
                full_name: safeProfile.full_name || '',
                phone: safeProfile.phone || '',
                location: safeProfile.location || '',
                bio: safeProfile.bio || '',
                desired_roles: safeProfile.desired_roles || [],
                preferred_locations: safeProfile.preferred_locations || [],
                resume_url: safeProfile.resume_url || '',
                linkedin_url: safeProfile.linkedin_url || '',
                profile_picture_url: safeProfile.profile_picture_url || '',
                skills: safeProfile.skills || [], // FIX: Reads skills from the profiles table array
                education_history: education || [],
                work_experience: work || []
            };

            setProfileData(loadedProfileData);
            setEditData(loadedProfileData);
            
            // Set user data for display with robust fallbacks
            setUser({
                name: safeProfile.full_name || 'New User',
                avatar: safeProfile.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeProfile.full_name || 'U')}&background=random`,
                jobTitle: safeProfile.desired_roles?.[0] || 'Job Seeker'
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            alert('Could not fetch profile data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = async () => {
        try {
            setLoading(true);
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            // 1. Update Profile Picture if there's a preview
            let profilePictureUrl = profileData.profile_picture_url;
            if (avatarPreview) {
                const fileExt = avatarPreview.substring(avatarPreview.indexOf('/') + 1, avatarPreview.indexOf(';'));
                const fileName = `${authUser.id}/${Date.now()}.${fileExt}`;
                const filePath = `avatars/${fileName}`;
                const res = await fetch(avatarPreview);
                const blob = await res.blob();
                
                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, blob, { upsert: true });
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                profilePictureUrl = data.publicUrl;
            }

            // 2. Update the 'profiles' table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: editData.full_name,
                    phone: editData.phone,
                    location: editData.location,
                    bio: editData.bio,
                    skills: editData.skills, // FIX: Saves the skills array back to the profile
                    desired_roles: editData.desired_roles,
                    preferred_locations: editData.preferred_locations,
                    linkedin_url: editData.linkedin_url,
                    resume_url: editData.resume_url,
                    profile_picture_url: profilePictureUrl,
                    updated_at: new Date()
                })
                .eq('id', authUser.id);
            if (profileError) throw profileError;

            // 3. Update Education History (Delete all then insert new ones)
            const { error: deleteEduError } = await supabase.from("education_history").delete().eq("user_id", authUser.id);
            if (deleteEduError) throw deleteEduError;
            if (editData.education_history.length > 0) {
                const educationData = editData.education_history.map(
                    // Ensure we don't try to insert a client-side temporary id
                    ({ id, ...edu }) => ({ ...edu, user_id: authUser.id })
                );
                const { error: insertEduError } = await supabase.from("education_history").insert(educationData);
                if (insertEduError) throw insertEduError;
            }

            // 4. Update Work Experience (Delete all then insert new ones)
            const { error: deleteWorkError } = await supabase.from('work_experience').delete().eq('user_id', authUser.id);
            if (deleteWorkError) throw deleteWorkError;
            if (editData.work_experience.length > 0) {
                const workData = editData.work_experience.map(({ id, ...work }) => ({
                    ...work,
                    user_id: authUser.id,
                }));
                const { error: insertWorkError } = await supabase.from('work_experience').insert(workData);
                if (insertWorkError) throw insertWorkError;
            }
            
            await fetchProfile();
            
            setIsEditing(false);
            setAvatarPreview(null);
            alert('Profile saved successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(`Error saving profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleLogout = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    }, []);

    const handleCancel = () => {
        setEditData(profileData);
        setIsEditing(false);
        setAvatarPreview(null);
    };

    const addSkill = () => {
        const trimmedSkill = newSkill.trim();
        if (trimmedSkill && !editData.skills.includes(trimmedSkill)) {
            setEditData({ ...editData, skills: [...editData.skills, trimmedSkill] });
            setNewSkill('');
        }
    };
    const removeSkill = (skillToRemove) => setEditData({ ...editData, skills: editData.skills.filter(s => s !== skillToRemove) });

    const addDesiredRole = () => {
        const trimmedRole = newDesiredRole.trim();
        if (trimmedRole && !editData.desired_roles.includes(trimmedRole)) {
            setEditData({ ...editData, desired_roles: [...editData.desired_roles, trimmedRole] });
            setNewDesiredRole('');
        }
    };
    const removeDesiredRole = (roleToRemove) => setEditData({ ...editData, desired_roles: editData.desired_roles.filter(r => r !== roleToRemove) });

    const addPreferredLocation = () => {
        const trimmedLocation = newPreferredLocation.trim();
        if (trimmedLocation && !editData.preferred_locations.includes(trimmedLocation)) {
            setEditData({ ...editData, preferred_locations: [...editData.preferred_locations, trimmedLocation] });
            setNewPreferredLocation('');
        }
    };
    const removePreferredLocation = (locationToRemove) => setEditData({ ...editData, preferred_locations: editData.preferred_locations.filter(l => l !== locationToRemove) });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleFileDrop = (e, fileHandler) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            fileHandler(e.dataTransfer.files[0]);
        }
    };
    
    const handleFileInput = (e, fileHandler) => {
        if (e.target.files && e.target.files[0]) {
            fileHandler(e.target.files[0]);
        }
    };

    const processAvatarFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };
    
    const handleEducationChange = (index, field, value) => {
        const newEducationHistory = editData.education_history.map((edu, i) => 
            i === index ? { ...edu, [field]: value } : edu
        );
        setEditData({ ...editData, education_history: newEducationHistory });
    };

    const addEducation = () => {
        const newEducation = { institution_name: '', degree: '', field_of_study: '', start_date: '', end_date: '' };
        setEditData({ ...editData, education_history: [newEducation, ...editData.education_history] });
    };

    const removeEducation = (index) => {
        const newEducationHistory = editData.education_history.filter((_, i) => i !== index);
        setEditData({ ...editData, education_history: newEducationHistory });
    };
    
    const handleWorkChange = (index, field, value) => {
        const newWorkExperience = editData.work_experience.map((work, i) =>
            i === index ? { ...work, [field]: value } : work
        );
        setEditData({ ...editData, work_experience: newWorkExperience });
    };

    const addWorkExperience = () => {
        const newWork = { job_title: '', company_name: '', description: '', start_date: '', end_date: '' };
        setEditData({ ...editData, work_experience: [newWork, ...editData.work_experience] });
    };

    const removeWorkExperience = (index) => {
        const newWorkExperience = editData.work_experience.filter((_, i) => i !== index);
        setEditData({ ...editData, work_experience: newWorkExperience });
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-blue-50 items-center justify-center">
                <div className="text-xl font-semibold text-blue-600">Loading Profile...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-blue-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">JobSeek</h1>
                </div>
                <nav className="mt-6">
                    {['Dashboard', 'Profile', 'Saved Jobs'].map(tab => (
                        <Link 
                            to={`/${tab.toLowerCase().replace(' ', '')}`}
                            key={tab}
                            className={`flex items-center cursor-pointer px-6 py-3 ${activeTab === tab ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-100'}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <span className="mx-4 font-medium">{tab}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className='flex-1 rounded-lg space-y-3 overflow-auto'>
                <header className="flex items-center justify-between p-5 bg-white shadow-sm sticky top-0 z-10">
                    <h2 className="text-xl font-semibold text-gray-800">{activeTab}</h2>
                    <div className="flex items-center">
                        <div className="mr-2 text-right">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.jobTitle}</p>
                        </div>
                        <div className="relative">
                            <img className="w-10 h-10 rounded-full object-cover" src={user.avatar} alt="User avatar" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className='pl-4'>
                            <button onClick={handleLogout} className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <main className='px-3 space-y-3 pb-6'>
                    {/* Profile Photo and Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="flex flex-col items-center">
                                <div 
                                    className="relative group cursor-pointer"
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={(e) => handleFileDrop(e, processAvatarFile)}
                                    onClick={() => isEditing && document.getElementById('avatar-upload').click()}
                                >
                                    <img 
                                        src={avatarPreview || profileData.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name || 'U')}&background=random`} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover shadow-lg"
                                    />
                                    {isEditing && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                    )}
                                    <input type="file" id="avatar-upload" accept="image/*" onChange={(e) => handleFileInput(e, processAvatarFile)} className="hidden"/>
                                </div>
                                {isEditing && <button className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => document.getElementById('avatar-upload').click()}>Change Photo</button>}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input type="text" value={editData.full_name} onChange={(e) => setEditData({ ...editData, full_name: e.target.value })} className="text-3xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 w-full"/>
                                        <div className="flex items-center gap-2">
                                            <input type="text" value={newDesiredRole} onChange={(e) => setNewDesiredRole(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addDesiredRole()} className="text-xl text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 flex-1" placeholder="Add desired role"/>
                                            <button onClick={addDesiredRole} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {editData.desired_roles.map((role, index) => <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{role}<button onClick={() => removeDesiredRole(role)} className="text-blue-600 hover:text-blue-800">×</button></span>)}
                                        </div>
                                        <textarea value={editData.bio} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} className="text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-3 w-full" rows="3" placeholder="Write a short bio"/>
                                    </div>
                                ) : (
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.full_name || 'Your Name'}</h1>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {profileData.desired_roles?.length > 0 ? profileData.desired_roles.map((role, index) => <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{role}</span>) : <span className="text-gray-500">No desired roles specified.</span>}
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{profileData.bio || 'Your bio will appear here. Click "Edit Profile" to add one.'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact & Location</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input type="email" value={editData.email || ''} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                {isEditing ? <input type="text" value={editData.phone || ''} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /> : <p className="text-gray-900">{profileData.phone || 'Not provided'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                {isEditing ? <input type="text" value={editData.location || ''} onChange={(e) => setEditData({ ...editData, location: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /> : <p className="text-gray-900">{profileData.location || 'Not provided'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                                {isEditing ? <input type="url" value={editData.linkedin_url || ''} onChange={(e) => setEditData({ ...editData, linkedin_url: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /> : <p className="text-gray-900 truncate"><a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profileData.linkedin_url || 'Not provided'}</a></p>}
                            </div>

                            {/* FIX: Preferred Locations section */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                                {isEditing ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input type="text" value={newPreferredLocation} onChange={(e) => setNewPreferredLocation(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addPreferredLocation()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Add preferred location" />
                                            <button onClick={addPreferredLocation} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {editData.preferred_locations.map((loc, index) => (
                                                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{loc}<button onClick={() => removePreferredLocation(loc)} className="text-green-600 hover:text-green-800">×</button></span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.preferred_locations?.length > 0 ? profileData.preferred_locations.map((loc, index) => <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{loc}</span>) : <p className="text-gray-500">No preferred locations specified.</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FIX: Skills Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                        {isEditing ? (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addSkill()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" placeholder="Add a skill" />
                                    <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {editData.skills.map((skill, index) => (
                                        <span key={index} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{skill}<button onClick={() => removeSkill(skill)} className="text-blue-600 hover:text-blue-800"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {profileData.skills?.length > 0 ? profileData.skills.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{skill}</span>
                                )) : <p className="text-gray-500">No skills added yet.</p>}
                            </div>
                        )}
                    </div>
                    
                    {/* Education History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Education History</h2>
                        {isEditing ? (
                            <div className="space-y-4">
                                <button onClick={addEducation} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Education</button>
                                {editData.education_history.map((edu, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Institution</label><input type="text" value={edu.institution_name || ""} onChange={(e) => handleEducationChange(index, "institution_name", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Degree</label><input type="text" value={edu.degree || ""} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label><input type="text" value={edu.field_of_study || ""} onChange={(e) => handleEducationChange(index, "field_of_study", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" value={edu.start_date || ""} onChange={(e) => handleEducationChange(index, "start_date", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={edu.end_date || ""} onChange={(e) => handleEducationChange(index, "end_date", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                        </div>
                                        <button onClick={() => removeEducation(index)} className="mt-2 px-4 py-2 text-red-600 hover:text-red-800">Remove</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profileData.education_history?.map((edu, index) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-6 py-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}</h3>
                                        <p className="text-gray-600">{edu.institution_name}</p>
                                        <p className="text-sm text-gray-500">{new Date(edu.start_date).toLocaleDateString()} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString() : "Present"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Work Experience */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Work Experience</h2>
                        {isEditing ? (
                            <div className="space-y-4">
                                <button onClick={addWorkExperience} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Experience</button>
                                {editData.work_experience.map((work, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label><input type="text" value={work.job_title || ''} onChange={(e) => handleWorkChange(index, 'job_title', e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Company</label><input type="text" value={work.company_name || ''} onChange={(e) => handleWorkChange(index, 'company_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                        </div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={work.description || ''} onChange={(e) => handleWorkChange(index, 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" rows="3"/></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" value={work.start_date || ''} onChange={(e) => handleWorkChange(index, "start_date", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={work.end_date || ''} onChange={(e) => handleWorkChange(index, "end_date", e.target.value)} className="w-full px-4 py-2 border rounded-lg"/></div>
                                        </div>
                                        <button onClick={() => removeWorkExperience(index)} className="mt-2 px-4 py-2 text-red-600 hover:text-red-800">Remove</button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {profileData.work_experience?.map((work, index) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-6 py-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{work.job_title}</h3>
                                        <p className="text-gray-600">{work.company_name}</p>
                                        <p className="text-sm text-gray-500">{new Date(work.start_date).toLocaleDateString()} - {work.end_date ? new Date(work.end_date).toLocaleDateString() : 'Present'}</p>
                                        <p className="text-gray-700 mt-2">{work.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 sticky bottom-0">
                        {isEditing ? (
                            <>
                                <button onClick={handleCancel} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Profile</button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;