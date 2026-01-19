import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup } from '../types';
import { BLOOD_GROUPS } from '../constants';
import { LogOut, Save, Camera, Shield, Eye, EyeOff, Calendar, MapPin, Hash, Droplets } from 'lucide-react';

interface ProfileProps {
  userProfile: Donor | null;
  onUpdate: (profile: Donor) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(!userProfile);
  const [formData, setFormData] = useState<Partial<Donor>>(userProfile || {
    fullName: '',
    phoneNumber: '',
    bloodGroup: 'A+' as BloodGroup,
    age: 18,
    isAvailable: true,
    hidePhone: false,
    lastDonationDate: null,
    location: { lat: 23.8103, lng: 90.4125, address: '' }
  });

  // Keep internal form state in sync with external profile state
  useEffect(() => {
    if (userProfile) {
      setFormData(userProfile);
      // Only close editing mode if the user actually exists (wasn't just created)
      if (userProfile.fullName) {
        setIsEditing(false);
      }
    }
  }, [userProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phoneNumber) {
      alert("Please enter your name and phone number");
      return;
    }
    const updatedProfile = {
      ...formData as Donor,
      id: userProfile?.id || Date.now().toString()
    };
    onUpdate(updatedProfile);
    setIsEditing(false);
  };

  const toggleAvailability = () => {
    if (!userProfile) return;
    const newVal = !formData.isAvailable;
    const updatedProfile = { ...userProfile, isAvailable: newVal };
    setFormData(updatedProfile);
    onUpdate(updatedProfile);
  };

  const togglePrivacy = () => {
    if (!userProfile) return;
    const newVal = !formData.hidePhone;
    const updatedProfile = { ...userProfile, hidePhone: newVal };
    setFormData(updatedProfile);
    onUpdate(updatedProfile);
  };

  return (
    <div className="p-4 pb-24">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-6">
        <div className="bg-gray-50 p-8 flex flex-col items-center border-b border-gray-100 relative">
          <div className="relative group">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-4xl font-black shadow-inner border-4 border-white overflow-hidden">
               {formData.fullName?.[0] || '?'}
            </div>
            <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md text-gray-600 border border-gray-100">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="mt-4 text-xl font-bold text-gray-800 text-center px-4">
            {formData.fullName || 'Complete Your Profile'}
          </h2>
          <p className="text-sm text-gray-500">{formData.phoneNumber || 'Enter your details below'}</p>
          
          {userProfile && (
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="text-red-600 text-sm font-bold bg-white px-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-red-300 transition-colors">
                <Hash className="text-gray-400 mr-3" size={18} />
                <input 
                  type="text" 
                  value={formData.fullName || ''}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm py-2"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 focus-within:border-red-300 transition-colors">
                <Hash className="text-gray-400 mr-3" size={18} />
                <input 
                  type="tel" 
                  value={formData.phoneNumber || ''}
                  onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm py-2"
                  placeholder="017XXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Blood Group</label>
                <select 
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 text-sm outline-none focus:border-red-300 appearance-none"
                  value={formData.bloodGroup}
                  onChange={e => setFormData({...formData, bloodGroup: e.target.value as BloodGroup})}
                >
                  {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Age</label>
                <input 
                  type="number"
                  className="w-full bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 text-sm outline-none focus:border-red-300"
                  value={formData.age || ''}
                  min="18"
                  max="65"
                  onChange={e => setFormData({...formData, age: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Location Address</label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100">
                <MapPin className="text-gray-400 mr-3" size={18} />
                <input 
                  type="text" 
                  value={formData.location?.address || ''}
                  onChange={e => setFormData({...formData, location: {...formData.location!, address: e.target.value}})}
                  className="bg-transparent w-full outline-none text-sm py-2"
                  placeholder="Street, City"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Last Donation Date</label>
              <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100">
                <Calendar className="text-gray-400 mr-3" size={18} />
                <input 
                  type="date" 
                  value={formData.lastDonationDate || ''}
                  onChange={e => setFormData({...formData, lastDonationDate: e.target.value})}
                  className="bg-transparent w-full outline-none text-sm py-2"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-red-200 active:scale-95 transition-all mt-6"
            >
              <Save size={20} />
              <span>Save Profile</span>
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Blood Type</p>
                <p className="text-2xl font-black text-red-600">{formData.bloodGroup}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
                <p className={`text-xl font-black ${formData.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                  {formData.isAvailable ? 'Active' : 'Offline'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Privacy Mode</p>
                    <p className="text-[10px] text-gray-500">Hide phone from non-matches</p>
                  </div>
                </div>
                <button 
                  onClick={togglePrivacy}
                  className={`p-2 rounded-lg transition-colors active:scale-90 ${formData.hidePhone ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}
                >
                  {formData.hidePhone ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-50 p-2 rounded-lg text-green-600">
                    <Droplets size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Availability</p>
                    <p className="text-[10px] text-gray-500">Show profile in donor searches</p>
                  </div>
                </div>
                <div 
                  onClick={toggleAvailability}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors relative ${formData.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                   <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${formData.isAvailable ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
            </div>

            <button 
              className="w-full text-gray-400 font-bold py-4 flex items-center justify-center space-x-2 border-t border-gray-100 mt-4 active:text-red-600 transition-colors cursor-pointer"
              onClick={() => {
                if (confirm("Logout and clear your profile data?")) {
                  localStorage.removeItem('bbdh_profile');
                  window.location.reload();
                }
              }}
            >
              <LogOut size={18} />
              <span>Logout & Clear Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;