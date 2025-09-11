import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Camera, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProfile,
  updateMyProfile,
} from "../../features/profile/profileSlice";
import {
  uploadImage,
  updateImage,
  clearImageState,
} from "../../features/image/imageSlice";
import { changePassword, deleteUser } from "../../features/auth/loginAuth/authThunks";
import { getAllActivities } from "../../Admin/api/activities";
import { fetchCitiesThunk } from "../../features/plan/LocationSlice";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: profile, status } = useSelector((state) => state.myProfile);

  const [username, setUsername] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [extraPref, setExtraPref] = useState("");
  const [cityId, setCityId] = useState(null);
  const [cityName, setCityName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({});
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteError, setDeleteError] = useState(null);
  const [cities, setCities] = useState([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const fileInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const cityDropdownRef = useRef(null);

  const placeCategories = [
    "natural",
    "cultural",
    "historic",
    "religious",
    "adventure",
    "wildlife",
    "educational",
    "architectural",
  ];

  useEffect(() => {
    dispatch(fetchMyProfile());
    return () => dispatch(clearImageState());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setSelectedCategories(profile.prefer_place_categories || []);
      setSelectedActivities(profile.prefer_activities?.map((a) => a.id) || []);
      setExtraPref(profile.additional_preferences || "");
      setCityId(profile.city?.id || null);
      setCityName(profile.city?.name || "");
      setImagePreview(profile.image?.url || null);
      setMessage(null);
    }
  }, [profile]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getAllActivities({ page: 1, size: 50 });
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities", err);
      }
    };
    fetchActivities();
  }, []);

  const fetchCitiesOnSearch = async (search) => {
    if (search.length < 2) {
      setCities([]);
      return;
    }
    try {
      const result = await dispatch(fetchCitiesThunk({ search })).unwrap();
      setCities(result);
    } catch (err) {
      console.error("Failed to fetch cities:", err);
    }
  };

  useEffect(() => {
    if (citySearchTerm) {
      fetchCitiesOnSearch(citySearchTerm);
    }
  }, [citySearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cityInputRef.current && !cityInputRef.current.contains(event.target) &&
        cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)
      ) {
        setShowCityDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cityInputRef, cityDropdownRef]);

  const isUnsaved = useMemo(() => {
    if (!profile) return false;
    return (
      username !== (profile.username || "") ||
      extraPref !== (profile.additional_preferences || "") ||
      cityId !== (profile.city?.id || null) ||
      imageFile !== null ||
      JSON.stringify(selectedCategories) !==
      JSON.stringify(profile.prefer_place_categories || []) ||
      JSON.stringify(selectedActivities) !==
      JSON.stringify(profile.prefer_activities?.map((a) => a.id) || [])
    );
  }, [
    username,
    extraPref,
    cityId,
    imageFile,
    selectedCategories,
    selectedActivities,
    profile,
  ]);

  useEffect(() => {
    if (isUnsaved) {
      setMessage({ type: "info", text: "You have unsaved changes" });
    }
  }, [isUnsaved]);

  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleActivityToggle = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCitySelect = (city) => {
    setCityId(city.id);
    setCityName(city.name);
    setCitySearchTerm(city.name);
    setShowCityDropdown(false);
  };

  const handleSaveProfile = async () => {
    let imageId = profile.image?.id || null;

    if (imageFile) {
      try {
        const imgRes = imageId
          ? await dispatch(updateImage({ imageId, file: imageFile })).unwrap()
          : await dispatch(
            uploadImage({ file: imageFile, category: "user_profile" })
          ).unwrap();
        imageId = imgRes.id;
      } catch (err) {
        setMessage({ type: "error", text: "Image upload failed: " + err });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    try {
      if (username.length < 3 || username.length > 20) {
        setMessage({
          type: "error",
          text: "Username must be between 3 and 20 characters",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const updatedProfile = await dispatch(
        updateMyProfile({
          username,
          image_id: imageId,
          city_id: cityId,
          prefer_place_categories: selectedCategories,
          prefer_travel_distance: profile.prefer_travel_distance,
          additional_preferences: extraPref,
          prefer_activities: selectedActivities,
        })
      ).unwrap();

      setImagePreview(updatedProfile.image?.url || null);
      setImageFile(null);
      setMessage({ type: "success", text: "Profile updated successfully" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setMessage({ type: "error", text: err });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({
        msg: "New password and confirmation do not match",
        type: "error",
      });
      return;
    }
    try {
      const msg = await dispatch(
        changePassword({ oldPassword, newPassword })
      ).unwrap();
      setPasswordMsg({ msg, type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg({ msg: err, type: "error" });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== profile.email) {
      setDeleteError("Email does not match your profile email.");
      return;
    }

    try {
      await dispatch(deleteUser(deletePassword)).unwrap();
      navigate('/login');
    } catch (err) {
      setDeleteError(err.message || "Account deletion failed.");
    }
  };

  if (status === "loading")
    return (
      <div className="p-6 mt-10 max-w-2xl mx-auto space-y-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
        {/* Profile Image Skeleton */}
        <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "0ms" }}></div>

        {/* Username Skeleton */}
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "60ms" }}></div>

        {/* Categories Skeleton */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-300 rounded animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${120 + i * 60}ms` }}
            ></div>
          ))}
        </div>

        {/* Activities Skeleton */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-300 rounded animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${360 + i * 60}ms` }}
            ></div>
          ))}
        </div>

        {/* Extra Preferences Skeleton */}
        <div className="h-20 bg-gray-300 rounded w-full animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "600ms" }}></div>

        {/* Save Button Skeleton */}
        <div className="h-10 bg-gray-300 rounded w-32 mx-auto mt-4 animate-pulse opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]" style={{ animationDelay: "700ms" }}></div>

        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );


  return (
    <div className="p-6 mt-10 max-w-2xl mx-auto space-y-6">
      {/* ✅ Message Box */}
      {message && (
        <div
          className={`p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex flex-col items-center">
        <div
          onClick={() => fileInputRef.current.click()}
          className="relative cursor-pointer group w-24 h-24 rounded-full overflow-hidden"
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center text-2xl text-white">
              {username[0]?.toUpperCase()}
            </div>
          )}

          {/* Hover overlay with camera */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white w-6 h-6" />
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <p className="text-xs text-gray-500 mt-2">Click profile to change image</p>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-semibold">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          autoComplete="off"
        />
      </div>

      {/* City Search and Select */}
      <div className="relative">
        <label className="block text-sm font-semibold mb-1">Select the city you live in</label>
        <div className="relative">
          <input
            type="text"
            ref={cityInputRef}
            value={citySearchTerm || cityName}
            onChange={(e) => {
              setCitySearchTerm(e.target.value);
              setShowCityDropdown(true);
              if (e.target.value === "") {
                setCityId(null);
                setCityName("");
              }
            }}
            onFocus={() => setShowCityDropdown(true)}
            placeholder="Search for a city..."
            className="w-full border p-2 rounded"
          />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {showCityDropdown && cities.length > 0 && (
          <ul
            ref={cityDropdownRef}
            className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto"
          >
            {cities.map((city) => (
              <li
                key={city.id}
                onClick={() => handleCitySelect(city)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Place Categories */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Select place categories you are interested in
        </label>
        <div className="flex flex-wrap gap-2">
          {placeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={`px-3 py-1 rounded border ${
                selectedCategories.includes(cat)
                  ? "bg-primary text-white"
                  : "bg-white border-black text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Select your favorite activities
        </label>
        <div className="flex flex-wrap gap-2">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => handleActivityToggle(a.id)}
              className={`px-3 py-1 rounded border ${
                selectedActivities.includes(a.id)
                  ? "bg-primary text-white"
                  : "bg-white border-black text-black"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Extra Preferences */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Enter any additional preferences you want our agent to know
        </label>
        <textarea
          value={extraPref}
          onChange={(e) => setExtraPref(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <button
        onClick={handleSaveProfile}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>

      {/* Password Change */}
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-2">Change Password</h3>

        {/* Current Password */}
        <div className="relative mb-2">
          <input
            type={showPassword.current ? "text" : "password"}
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, current: !prev.current }))
            }
          >
            {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative mb-2">
          <input
            type={showPassword.new ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, new: !prev.new }))
            }
          >
            {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-2">
          <input
            type={showPassword.confirm ? "text" : "password"}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() =>
              setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
          >
            {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleChangePassword}
          disabled={
            !oldPassword || !newPassword || newPassword !== confirmPassword
          }
          className={`px-4 py-2 rounded text-white ${
            !oldPassword || !newPassword || newPassword !== confirmPassword
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary"
          }`}
        >
          Change Password
        </button>

        {passwordMsg && (
          <p
            className={
              passwordMsg.type == "success" ? "text-green-500" : "text-red-500"
            }
          >
            {passwordMsg.msg}
          </p>
        )}
      </div>
      <div className="border-t pt-4 mt-4">
      <Link to={'/forget_password'} className="text-right text-xs mt-1 text-gray-500 hover:underline cursor-pointer">
            forgot password ?
          </Link>
        </div>

      {/* Logout & Delete Account */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={() => navigate("/logout")}
          className="flex-1 bg-red-500 text-white border px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 bg-gray-500 text-white border px-4 py-2 rounded hover:bg-gray-600"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed h-screen w-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-center">Permanently Delete Account</h3>
            <p className="text-sm text-center text-gray-600 mb-4">
              This action cannot be undone. Please confirm by entering your email and password.
            </p>
            {deleteError && (
              <p className="text-red-500 text-sm mb-2 text-center">{deleteError}</p>
            )}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400"
                disabled={!deletePassword || !deleteEmail || deleteEmail !== profile.email}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}