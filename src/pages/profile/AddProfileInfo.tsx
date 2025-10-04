import React, { useEffect, useState } from "react";
import pencil from "../../assets/icons/pencil.svg";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/label/Label";
import { Button } from "../../components/button/Button";
import { Avatar } from "../../components/avatar/Avatar";
import { getUserDetails, updateProfile } from "../../api/route";
import './AddProfileInfo.scss';

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  birthdate: string;
  gender: string;
}

export const AddProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    birthdate: '',
    gender: ''
  });

  const [formData, setFormData] = useState<UserProfile>(profile);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const userDetails = await getUserDetails();

      if (userDetails) {
        const profileData: UserProfile = {
          first_name: userDetails.first_name || '',
          last_name: userDetails.last_name || '',
          phone_number: userDetails.phone_number || '',
          email: userDetails.email || '',
          birthdate: userDetails.birthdate || '',
          gender: userDetails.gender || ''
        };
        setProfile(profileData);
        setFormData(profileData);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.email) {
        setError('Please fill in all required fields');
        return;
      }

      // Format birthdate to YYYY-MM-DD if needed
      const formattedData = {
        ...formData,
        birthdate: formData.birthdate.includes('-')
          ? formData.birthdate
          : formData.birthdate
      };

      const response = await updateProfile(formattedData);

      if (response.data) {
        setProfile(formData);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);

        // Update localStorage
        localStorage.setItem('userDetails', JSON.stringify(response.data.user));

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[2.4rem]">
      <div className="profile">
        <div className="profile__avatar">
          <Avatar
            firstName={profile.first_name || 'User'}
            lastName={profile.last_name}
            size="medium"
          />
          <div className="profile__avatar__details">
            <div className="profile__avatar__details__name">
              {profile.first_name} {profile.last_name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[.3rem] cursor-pointer" onClick={handleEdit}>
          <div className="flex">
            <img src={pencil} alt="Edit" />
          </div>
          <button className="bg-transparent border-none underline text-[1.6rem]">
            Edit Profile
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="flex flex-col border border-solid border-[#D5D7DA] rounded-xl w-full">
        <div className="flex items-center justify-between bg-[#FFF1E7] py-[1.8rem] px-[2.4rem] rounded-t-xl">
          <h3 className="text-[1.6rem] font-medium">
            Personal Information
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-x-[2.4rem] gap-y-[1.6rem] py-[3rem] px-[2.4rem]">
          <Label title={'First Name *'} htmlFor={'firstName'} classnames={'label'}>
            <Input
              type={'text'}
              placeholder={'First Name'}
              id={'firstName'}
              value={formData.first_name}
              classnames={'inputField'}
              handleChange={(e) => handleInputChange('first_name', e.target.value)}
              disabled={!isEditing}
            />
          </Label>

          <Label title={'Last Name *'} htmlFor={'lastName'} classnames={'label'}>
            <Input
              type={'text'}
              placeholder={'Last Name'}
              id={'lastName'}
              value={formData.last_name}
              classnames={'inputField'}
              handleChange={(e) => handleInputChange('last_name', e.target.value)}
              disabled={!isEditing}
            />
          </Label>

          <Label title={'Email *'} htmlFor={'email'} classnames={'label'}>
            <Input
              type={'email'}
              placeholder={'Email'}
              id={'email'}
              value={formData.email}
              classnames={'inputField'}
              handleChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
            />
          </Label>

          <Label title={'Phone Number *'} htmlFor={'phoneNumber'} classnames={'label'}>
            <Input
              type={'tel'}
              placeholder={'Phone Number'}
              id={'phoneNumber'}
              value={formData.phone_number}
              classnames={'inputField'}
              handleChange={(e) => handleInputChange('phone_number', e.target.value)}
              disabled={!isEditing}
            />
          </Label>

          <Label title={'Birthdate *'} htmlFor={'birthdate'} classnames={'label'}>
            <Input
              type={'date'}
              placeholder={'YYYY-MM-DD'}
              id={'birthdate'}
              value={formData.birthdate}
              classnames={'inputField'}
              handleChange={(e) => handleInputChange('birthdate', e.target.value)}
              disabled={!isEditing}
            />
          </Label>

          <Label title={'Gender *'} htmlFor={'gender'} classnames={'label'}>
            <select
              id={'gender'}
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              disabled={!isEditing}
              className={`inputField ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
              style={{
                width: '100%',
                padding: '1.2rem 1.6rem',
                fontSize: '1.6rem',
                border: '1px solid #D5D7DA',
                borderRadius: '0.8rem',
                backgroundColor: isEditing ? 'white' : '#f5f5f5'
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </Label>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-[1.6rem] py-[2rem] px-[2.4rem] border-t border-solid border-[#D5D7DA]">
            <Button
              title={'Cancel'}
              type={'tertiary'}
              handleClick={handleCancel}
              disabled={isLoading}
            />
            <Button
              title={isLoading ? 'Saving...' : 'Save Changes'}
              type={'primary'}
              handleClick={handleSave}
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};
