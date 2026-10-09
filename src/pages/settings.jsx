import { useEffect, useState } from "react";
import api from "../api/api";
import "../assets/css/settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("auth/profile/");
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEmailChange = (e) => {
    setProfile({
      ...profile,
      email: e.target.value,
    });
  };

  const saveProfile = async () => {
    try {
      const response = await api.put("auth/profile/", {
        email: profile.email,
      });

      setProfile(response.data);
      setMessageType("success");
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessageType("error");
      setMessage("Failed to update profile.");
    }
  };

  const changePassword = async () => {
    setPasswordMessage("");
    setPasswordError("");

    try {
      await api.put("auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      setPasswordMessage("Password changed successfully.");

      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error changing password:", error);

      if (error.response?.data?.old_password) {
        setPasswordError(error.response.data.old_password[0]);
      } else if (error.response?.data?.new_password) {
        setPasswordError(error.response.data.new_password[0]);
      } else {
        setPasswordError("Failed to change password.");
      }
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <p className="settings-loading">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and security</p>
      </header>

      <div className="settings-grid">
        {/* Profile Settings */}
        <section className="settings-card profile-card">
          <div className="profile-summary">
            <span className="avatar-lg" aria-hidden="true">
              {profile.username.charAt(0).toUpperCase() || "U"}
            </span>
            <div>
              <h2>Profile</h2>
              <p>{profile.username}</p>
            </div>
          </div>

          <div className="settings-field">
            <label htmlFor="settings-username">Username</label>
            <input
              id="settings-username"
              type="text"
              value={profile.username}
              disabled
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settings-email">Email</label>
            <input
              id="settings-email"
              type="email"
              placeholder="you@example.com"
              value={profile.email}
              onChange={handleEmailChange}
            />
          </div>

          {message && (
            <p className={`settings-alert ${messageType}`} role="status">
              {message}
            </p>
          )}

          <button className="settings-submit" onClick={saveProfile}>
            Save Changes
          </button>
        </section>

        {/* Change Password */}
        <section className="settings-card password-card">
          <h2>Change Password</h2>

          <div className="settings-field">
            <label htmlFor="settings-old-password">Current Password</label>
            <input
              id="settings-old-password"
              type="password"
              autoComplete="current-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settings-new-password">New Password</label>
            <input
              id="settings-new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {passwordMessage && (
            <p className="settings-alert success" role="status">
              {passwordMessage}
            </p>
          )}

          {passwordError && (
            <p className="settings-alert error" role="alert">
              {passwordError}
            </p>
          )}

          <button className="settings-submit" onClick={changePassword}>
            Change Password
          </button>
        </section>
      </div>
    </div>
  );
}

export default Settings;