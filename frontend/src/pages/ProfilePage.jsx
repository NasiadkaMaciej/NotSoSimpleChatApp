import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Pipette, User } from "lucide-react";
import { toast } from "react-hot-toast";

import FormInput from "../components/auth/FormInput";
import Avatar from "../components/shared/Avatar";
import Modal from "../components/shared/Modal";
import { isPasswordValid } from "../../../backend/src/utils/validate";
import { api } from "../services/api";

const MAX_ABOUT_LENGTH = 256;

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile, logout } = useAuthStore();
	const [selectedColor, setSelectedColor] = useState(authUser.avatarColor || "#ffffff");
	const [aboutMe, setAboutMe] = useState(authUser.aboutMe || "");
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const timeoutRef = useRef(null);
	const [showUpdateUsername, setShowUpdateUsername] = useState(false);
	const [showUpdatePassword, setShowUpdatePassword] = useState(false);
	const [newUsername, setNewUsername] = useState("");
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [notificationSettings, setNotificationSettings] = useState({
		enableNotifications: authUser?.notificationSettings?.enableNotifications ?? true,
		mutedUsers: authUser?.notificationSettings?.mutedUsers ?? [] // Add this line
	});


	useEffect(() => {
		setSelectedColor(authUser.avatarColor || "#ffffff");
		setAboutMe(authUser.aboutMe || "");
	}, [authUser]);

	const handleColorChange = (e) => {
		const color = e.target.value;
		setSelectedColor(color);
		clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(async () => {
			await updateProfile({ avatarColor: color, aboutMe: aboutMe });
		}, 2000);
	};

	// Save about me text after 2 seconds of inactivity
	const handleAboutMeChange = (e) => {
		const text = e.target.value;
		if (text.length <= MAX_ABOUT_LENGTH) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = setTimeout(async () => {
				setAboutMe(text);
				await updateProfile({ avatarColor: selectedColor, aboutMe: text });
			}, 2000);
			setAboutMe(text);
		}
	};

	const handleUpdateUsername = async (e) => {
		e.preventDefault();

		if (newUsername.length < 3) {
			toast.error("Username must be at least 3 characters long");
			return;
		}

		try {
			const res = await api.users.update({ newUsername });
			toast.success("Username updated successfully");
			setShowUpdateUsername(false);
			setNewUsername("");
			updateProfile(res.data);
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to update username");
		}
	};

	const handleUpdatePassword = async (e) => {
		e.preventDefault();

		// Validate password requirements
		if (!isPasswordValid(newPassword)) {
			toast.error("Password must be at least 12 characters and contain letters, numbers, and special characters");
			return;
		}

		// Check if passwords match
		if (newPassword !== confirmNewPassword) {
			toast.error("Passwords do not match");
			return;
		}

		try {
			await api.auth.updateCredentials({ currentPassword, newPassword });
			toast.success("Password updated successfully");
			setShowUpdatePassword(false);
			setCurrentPassword("");
			setNewPassword("");
			setConfirmNewPassword("");
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to update password");
		}
	};

	const handleDeactivate = async () => {
		try {
			await api.auth.deactivate();
			toast.success("Account deactivated successfully");
			logout();
		} catch (error) {
			toast.error("Failed to deactivate account");
		}
	};

	const handleNotificationToggle = async (setting) => {
		const newSettings = { ...notificationSettings, [setting]: !notificationSettings[setting] };
		setNotificationSettings(newSettings);

		try {
			await updateProfile({ notificationSettings: newSettings });
		} catch (error) {
			toast.error('Failed to update notification settings');
			setNotificationSettings(notificationSettings);
		}
	};

	return (
		<div className="h-screen pt-20">
			<div className="max-w-2xl mx-auto p-4 py-8">
				<div className="bg-base-300 rounded-xl p-6 space-y-8">
					<div className="text-center">
						<h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
							<User className="w-10 h-10" />
							Profile
						</h1>
						<p className="mt-2">Your profile information</p>
					</div>

					<div className="flex flex-col items-center gap-4">
						<div className="relative">
							<Avatar color={selectedColor} size="40" overrideTailwind={true} />
							<label
								htmlFor="color-picker"
								className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
							>
								<Pipette className="w-5 h-5 text-base-200" />
								<input
									type="color"
									id="color-picker"
									className="hidden absolute"
									value={selectedColor}
									onChange={handleColorChange}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						<p className="text-sm">
							{isUpdatingProfile ? "Updating..." : "Select your avatar color"}
						</p>
						<textarea
							className="textarea textarea-bordered w-full"
							placeholder="Simply say something about yourself"
							value={aboutMe}
							onChange={handleAboutMeChange}
							disabled={isUpdatingProfile}
							maxLength={MAX_ABOUT_LENGTH}
						></textarea>
					</div>

					<div className="space-y-6">
						<FormInput type="text" label="Username" placeholder={authUser?.username} icon="user" disabled />
						<FormInput type="text" label="Email Address" placeholder={authUser?.email} icon="mail" disabled />
					</div>

					<div className="space-y-6">
						<div className="collapse bg-base-200">
							<input type="checkbox" checked={showUpdateUsername} onChange={() => setShowUpdateUsername(!showUpdateUsername)} />
							<div className="collapse-title text-xl font-medium">
								Change Username
							</div>
							<div className="collapse-content">
								<form onSubmit={handleUpdateUsername} className="space-y-4">
									<FormInput
										type="text"
										label="New Username"
										placeholder="Enter new username"
										value={newUsername}
										onChange={(e) => setNewUsername(e.target.value)}
										icon="user"
									/>
									<button type="submit" className="btn btn-primary w-full" disabled={!newUsername}>
										Update Username
									</button>
								</form>
							</div>
						</div>

						<div className="collapse bg-base-200">
							<input type="checkbox" checked={showUpdatePassword} onChange={() => setShowUpdatePassword(!showUpdatePassword)} />
							<div className="collapse-title text-xl font-medium">
								Change Password
							</div>
							<div className="collapse-content">
								<form onSubmit={handleUpdatePassword} className="space-y-4">
									<FormInput
										type="password"
										label="Current Password"
										placeholder="Enter current password"
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										icon="lock"
									/>
									<FormInput
										type="password"
										label="New Password"
										placeholder="Enter new password"
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										icon="lock"
									/>
									<FormInput
										type="password"
										label="Confirm New Password"
										placeholder="Confirm new password"
										value={confirmNewPassword}
										onChange={(e) => setConfirmNewPassword(e.target.value)}
										icon="lock"
									/>
									<button type="submit" className="btn btn-primary w-full" disabled={!currentPassword || !newPassword || !confirmNewPassword}>
										Update Password
									</button>
								</form>
							</div>
						</div>
					</div>


					<div className="collapse bg-base-200">
						<input type="checkbox" />
						<div className="collapse-title text-xl font-medium">
							Notification Settings
						</div>
						<div className="collapse-content space-y-4">
							<div className="form-control">
								<label className="label cursor-pointer justify-start gap-4">
									<input
										type="checkbox"
										className="toggle toggle-primary"
										checked={notificationSettings.enableNotifications}
										onChange={() => handleNotificationToggle('enableNotifications')}
									/>
									<span className="label-text">Enable notifications</span>
								</label>
							</div>
						</div>
					</div>

					<div className="mt-6 bg-base-300 rounded-xl p-6">
						<h2 className="text-lg font-medium mb-4">Account Information</h2>
						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between py-2 border-b border-zinc-700">
								<span>Member Since</span>
								<span>{authUser.createdAt?.split("T")[0]}</span>
							</div>
							<div className="flex items-center justify-between py-2">
								<span>Account Status</span>
								<span className="text-green-500">Active</span>
							</div>
							<div className="mt-8 text-center">
								<button
									onClick={() => setShowConfirmModal(true)}
									className="btn btn-error"
								>
									Deactivate Account
								</button>
								<Modal
									isOpen={showConfirmModal}
									title="Deactivate Account"
									message="Are you sure you want to deactivate your account?
											 This action cannot be undone.
											 All your profile data and messages will be removed."
									confirmText="Yes, Deactivate"
									confirmButtonClass="btn-error"
									onConfirm={handleDeactivate}
									onCancel={() => setShowConfirmModal(false)}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;