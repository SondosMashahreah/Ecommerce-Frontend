import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaAt,
  FaPen,
  FaKey,
  FaSignOutAlt,
  FaCamera,
  FaTimes,
  FaSave,
} from "react-icons/fa";

import {
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadProfileImage,
} from "../../services/api";

import backgroundImage from "./img/bac.png";

import "./Profile.css";


function Profile() {
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const [changingPassword, setChangingPassword] =
  useState(false);

const [currentPassword, setCurrentPassword] =
  useState("");

const [newPassword, setNewPassword] =
  useState("");

const [confirmPassword, setConfirmPassword] =
  useState("");

const [passwordSaving, setPasswordSaving] =
  useState(false);

const [showCurrentPassword, setShowCurrentPassword] =
  useState(false);

const [showNewPassword, setShowNewPassword] =
  useState(false);

const [showConfirmPassword, setShowConfirmPassword] =
  useState(false);

const [uploadingImage, setUploadingImage] =
  useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        setUser(data);
        setName(data.name || "");
        setUsername(data.username || "");

      } catch (error) {
        setError(
          error.message ||
          "Failed to load profile"
        );

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


  const handleStartEdit = () => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setUsername(user.username || "");

    setError("");
    setSuccess("");

    setEditing(true);
  };


  const handleCancelEdit = () => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
    }

    setError("");
    setSuccess("");

    setEditing(false);
  };


  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .toLowerCase();

    if (cleanName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }

    if (cleanUsername.length < 3) {
      setError(
        "Username must contain at least 3 characters."
      );

      return;
    }

    const usernamePattern =
      /^[a-zA-Z0-9_]+$/;

    if (
      !usernamePattern.test(
        cleanUsername
      )
    ) {
      setError(
        "Username can contain letters, numbers and underscore only."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedUser =
        await updateProfile({
          name: cleanName,
          username: cleanUsername,
        });

      setUser(updatedUser);

      setName(updatedUser.name);
      setUsername(
        updatedUser.username
      );

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );

    } catch (error) {
      setError(
        error.message ||
        "Failed to update profile"
      );

    } finally {
      setSaving(false);
    }
  };


  const handleStartPasswordChange = () => {
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  setError("");
  setSuccess("");

  setChangingPassword(true);
};


const handleCancelPasswordChange = () => {
  setCurrentPassword("");
  setNewPassword("");
  setConfirmPassword("");

  setError("");
  setSuccess("");

  setChangingPassword(false);
};


const handleChangePassword = async (event) => {
  event.preventDefault();

  setError("");
  setSuccess("");

  if (
    !currentPassword ||
    !newPassword ||
    !confirmPassword
  ) {
    setError(
      "Please fill in all password fields."
    );

    return;
  }

  if (newPassword.length < 6) {
    setError(
      "New password must contain at least 6 characters."
    );

    return;
  }

  if (newPassword !== confirmPassword) {
    setError(
      "New password and confirmation do not match."
    );

    return;
  }

  if (currentPassword === newPassword) {
    setError(
      "New password must be different from current password."
    );

    return;
  }

  try {
    setPasswordSaving(true);

    const result = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setChangingPassword(false);

    setSuccess(
      result.message ||
      "Password changed successfully."
    );

  } catch (error) {
    setError(
      error.message ||
      "Failed to change password."
    );

  } finally {
    setPasswordSaving(false);
  }
};

const handleProfileImageChange = async (
  event
) => {
  const file =
    event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setError(
      "Please select a JPG, PNG or WEBP image."
    );

    event.target.value = "";
    return;
  }


  const maxSize =
    5 * 1024 * 1024;

  if (file.size > maxSize) {
    setError(
      "Profile image must be smaller than 5 MB."
    );

    event.target.value = "";
    return;
  }


  try {
    setUploadingImage(true);

    setError("");
    setSuccess("");

    const updatedUser =
      await uploadProfileImage(file);

    setUser(updatedUser);

    setSuccess(
      "Profile picture updated successfully."
    );

  } catch (error) {
    setError(
      error.message ||
      "Failed to upload profile picture."
    );

  } finally {
    setUploadingImage(false);

    event.target.value = "";
  }
};


  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    navigate("/signin");
  };


  if (loading) {
    return (
      <div className="profile_loading">
        <div className="profile_spinner">
        </div>

        <p>
          Loading your profile...
        </p>
      </div>
    );
  }


  return (
    <div
      className="profile_page"
      style={{
        backgroundImage:
          `url(${backgroundImage})`,
      }}
    >
      <div className="profile_content">

        <div className="profile_heading">
          <p className="profile_small_title">
            MY ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your personal information
            and account settings.
          </p>
        </div>


        {error && (
          <div className="profile_error">
            {error}
          </div>
        )}


        {success && (
          <div className="profile_success">
            {success}
          </div>
        )}


        {user ? (
          <>
            <div className="profile_user">

              <div className="profile_avatar_wrapper">

                {user.profile_image_path ? (
                  <img
                    className="profile_avatar"
                    src={
                      `${import.meta.env.VITE_API_URL}` +
                      `/api/v1/assets/${user.profile_image_path}`
                    }
                    alt={user.name}
                  />
                ) : (
                  <div className="profile_avatar_default">
                    <FaUser />
                  </div>
                )}


        <label
  className={
    `profile_camera_btn ${
      uploadingImage
        ? "uploading"
        : ""
    }`
  }
  title="Change profile picture"
>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={
      handleProfileImageChange
    }
    disabled={uploadingImage}
    hidden
  />

  {uploadingImage ? (
    <span className="profile_camera_loader">
    </span>
  ) : (
    <FaCamera />
  )}

</label>
              </div>


              <div className="profile_welcome">
                <span>
                  Welcome back,
                </span>

                <h2>
                  {user.name}
                </h2>

                <p>
                  @{user.username}
                </p>
              </div>

            </div>


{!editing && !changingPassword && (
  <>
    <div className="profile_information">

      <div className="profile_info_row">

        <div className="profile_info_icon">
          <FaUser />
        </div>

        <div className="profile_info_text">
          <span>
            Full Name
          </span>

          <strong>
            {user.name}
          </strong>
        </div>

      </div>


      <div className="profile_info_row">

        <div className="profile_info_icon">
          <FaAt />
        </div>

        <div className="profile_info_text">
          <span>
            Username
          </span>

          <strong>
            @{user.username}
          </strong>
        </div>

      </div>


      <div className="profile_info_row">

        <div className="profile_info_icon">
          <FaEnvelope />
        </div>

        <div className="profile_info_text">
          <span>
            Email Address
          </span>

          <strong>
            {user.email}
          </strong>
        </div>

      </div>

    </div>


    <div className="profile_actions">

      <button
        type="button"
        className="profile_action_btn"
        onClick={handleStartEdit}
      >
        <FaPen />

        <span>
          Edit Profile
        </span>
      </button>


      <button
        type="button"
        className="profile_action_btn"
        onClick={handleStartPasswordChange}
      >
        <FaKey />

        <span>
          Change Password
        </span>
      </button>


      <button
        type="button"
        className="profile_logout_btn"
        onClick={handleLogout}
      >
        <FaSignOutAlt />

        <span>
          Logout
        </span>
      </button>

    </div>
  </>
)}


{editing && (
  <form
    className="profile_edit_form"
    onSubmit={handleSaveProfile}
  >

    <div className="profile_edit_header">

      <div>
        <span>
          PERSONAL INFORMATION
        </span>

        <h3>
          Edit Profile
        </h3>
      </div>


      <button
        type="button"
        className="profile_close_edit"
        onClick={handleCancelEdit}
        disabled={saving}
      >
        <FaTimes />
      </button>

    </div>


    <div className="profile_form_group">

      <label htmlFor="profile-name">
        Full Name
      </label>

      <div className="profile_input_wrapper">

        <FaUser />

        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Your full name"
          required
          disabled={saving}
        />

      </div>

    </div>


    <div className="profile_form_group">

      <label htmlFor="profile-username">
        Username
      </label>

      <div className="profile_input_wrapper">

        <FaAt />

        <input
          id="profile-username"
          type="text"
          value={username}
          onChange={(event) =>
            setUsername(event.target.value)
          }
          placeholder="Your username"
          required
          disabled={saving}
        />

      </div>

      <small>
        Letters, numbers and underscore only.
      </small>

    </div>


    <div className="profile_edit_actions">

      <button
        type="button"
        className="profile_cancel_btn"
        onClick={handleCancelEdit}
        disabled={saving}
      >
        <FaTimes />
        Cancel
      </button>


      <button
        type="submit"
        className="profile_save_btn"
        disabled={saving}
      >
        <FaSave />

        {saving
          ? "Saving..."
          : "Save Changes"}
      </button>

    </div>

  </form>
)}


{changingPassword && (
  <form
    className="profile_edit_form"
    onSubmit={handleChangePassword}
  >

    <div className="profile_edit_header">

      <div>
        <span>
          ACCOUNT SECURITY
        </span>

        <h3>
          Change Password
        </h3>
      </div>


      <button
        type="button"
        className="profile_close_edit"
        onClick={handleCancelPasswordChange}
        disabled={passwordSaving}
      >
        <FaTimes />
      </button>

    </div>


    <div className="profile_password_notice">
      <FaKey />

      <p>
        Choose a strong password that you
        don't use on another account.
      </p>
    </div>


    <div className="profile_form_group">

      <label htmlFor="current-password">
        Current Password
      </label>

      <div className="profile_input_wrapper">

        <FaKey />

        <input
          id="current-password"
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(
              event.target.value
            )
          }
          placeholder="Enter current password"
          autoComplete="current-password"
          disabled={passwordSaving}
          required
        />


        <button
          type="button"
          className="profile_password_eye"
          onClick={() =>
            setShowCurrentPassword(
              !showCurrentPassword
            )
          }
          tabIndex="-1"
        >
          {showCurrentPassword
            ? "Hide"
            : "Show"}
        </button>

      </div>

    </div>


    <div className="profile_form_group">

      <label htmlFor="new-password">
        New Password
      </label>

      <div className="profile_input_wrapper">

        <FaKey />

        <input
          id="new-password"
          type={
            showNewPassword
              ? "text"
              : "password"
          }
          value={newPassword}
          onChange={(event) =>
            setNewPassword(
              event.target.value
            )
          }
          placeholder="Enter new password"
          autoComplete="new-password"
          disabled={passwordSaving}
          required
        />


        <button
          type="button"
          className="profile_password_eye"
          onClick={() =>
            setShowNewPassword(
              !showNewPassword
            )
          }
          tabIndex="-1"
        >
          {showNewPassword
            ? "Hide"
            : "Show"}
        </button>

      </div>

      <small>
        Password must contain at least
        6 characters.
      </small>

    </div>


    <div className="profile_form_group">

      <label htmlFor="confirm-password">
        Confirm New Password
      </label>

      <div className="profile_input_wrapper">

        <FaKey />

        <input
          id="confirm-password"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
          placeholder="Confirm new password"
          autoComplete="new-password"
          disabled={passwordSaving}
          required
        />


        <button
          type="button"
          className="profile_password_eye"
          onClick={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
          tabIndex="-1"
        >
          {showConfirmPassword
            ? "Hide"
            : "Show"}
        </button>

      </div>

    </div>


    <div className="profile_edit_actions">

      <button
        type="button"
        className="profile_cancel_btn"
        onClick={handleCancelPasswordChange}
        disabled={passwordSaving}
      >
        <FaTimes />

        Cancel
      </button>


      <button
        type="submit"
        className="profile_save_btn"
        disabled={passwordSaving}
      >
        <FaKey />

        {passwordSaving
          ? "Changing..."
          : "Change Password"}
      </button>

    </div>

  </form>
)}

          </>
        ) : (
          !error && (
            <div className="profile_error">
              User information is unavailable.
            </div>
          )
        )}

      </div>
    </div>
  );
}


export default Profile;