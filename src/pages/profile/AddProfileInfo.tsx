import React, { useEffect, useState } from "react";
import pencil from "../../assets/icons/pencil.svg";
import warning from "../../assets/icons/warning.svg";
import { Input } from "../../components/input/Input";
import { Label } from "../../components/label/Label";
import { Button } from "../../components/button/Button";
import { Avatar } from "../../components/avatar/Avatar";
import { useProfilePicture } from "../../hooks/useProfilePicture";
import { getUserDetails, updateProfile } from "../../api/route";
import { useNavigate } from "react-router-dom";
import './AddProfileInfo.scss';

interface UserProfile {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  birthdate: string;
  passport_verification_status?: string;
  is_passport_uploaded?: boolean;
}

export const AddProfileInfo = () => {
  const navigate = useNavigate();
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
    passport_verification_status: 'pending',
    is_passport_uploaded: false
  });

  const [formData, setFormData] = useState<UserProfile>(profile);

  // Profile picture hook
  const {
    pictureUrl,
    loading: pictureLoading,
    uploadPicture,
    deletePicture
  } = useProfilePicture();

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
          passport_verification_status: userDetails.passport_verification_status || 'pending',
          is_passport_uploaded: userDetails.is_passport_uploaded || false
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
      if (!formData.first_name || !formData.last_name) {
        setError('Please fill in all required fields');
        return;
      }

      // Format birthdate to YYYY-MM-DD if needed and exclude email
      const { email, ...dataToUpdate } = formData;
      const formattedData = {
        ...dataToUpdate,
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

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('userDetailsUpdated'));

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

  const handleImageUpload = async (file: File) => {
    try {
      // If there's already a picture, delete it first
      if (pictureUrl) {
        console.log('Deleting existing profile picture before upload...');
        await deletePicture();
      }

      // Upload the new picture
      await uploadPicture(file);
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Failed to upload profile picture');
      console.error('Upload failed:', err);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[2.4rem] px-[4rem] md:px-24">
      <h3 className="text-[3.2rem] font-bold text-[#1B3A4B]">
        My Account
      </h3>
      <div className="profile">
        <div className="profile__avatar">
          <div className="relative">
            <Avatar
              firstName={profile.first_name || 'User'}
              lastName={profile.last_name}
              size="medium"
              profilePictureUrl={pictureUrl}
              editable={true}
              onImageUpload={handleImageUpload}
              loading={pictureLoading}
            />
            {pictureUrl && !pictureLoading && (
              <button
                onClick={async () => {
                  if (window.confirm('Are you sure you want to remove your profile picture?')) {
                    try {
                      await deletePicture();
                      setSuccess('Profile picture removed successfully!');
                      setTimeout(() => setSuccess(null), 3000);
                    } catch (err) {
                      setError('Failed to remove profile picture');
                      console.error('Delete failed:', err);
                    }
                  }
                }}
                className="absolute top-0 right-0 w-[2.2rem] h-[2.2rem] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center border-2 border-white cursor-pointer transition-colors"
                title="Remove photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <div className="profile__avatar__details">
            <div className="profile__avatar__details__name">
              {profile.first_name} {profile.last_name}
            </div>
            {profile.passport_verification_status && profile.passport_verification_status !== 'verified' &&
             (!profile.is_passport_uploaded || profile.passport_verification_status === 'rejected') && (
              <div className="flex items-center gap-[0.5rem] mt-[0.5rem]">
                <img src={warning} alt="Warning" className="w-[1.6rem] h-[1.6rem]" />
                <span className="text-[1.2rem] text-yellow-700">Not Verified</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-[1.6rem]">
          {profile.passport_verification_status && profile.passport_verification_status !== 'verified' &&
           (!profile.is_passport_uploaded || profile.passport_verification_status === 'rejected') && (
            <Button
              title="Verify"
              type="primary"
              handleClick={() => navigate('/profile-verification')}
            />
          )}
          <div className="flex items-center gap-[.3rem] cursor-pointer" onClick={handleEdit}>
            <div className="flex">
              <img src={pencil} alt="Edit" />
            </div>
            <button className="bg-transparent border-none underline text-[1.6rem]">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {profile.is_passport_uploaded && profile.passport_verification_status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-[1.6rem] font-semibold text-yellow-900">
              Verification Status: Pending
            </h4>
            <p className="text-[1.4rem] text-yellow-800">
              Your verification is being reviewed. We will notify you once it's complete.
            </p>
          </div>
        </div>
      )}

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
              disabled={true}
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
