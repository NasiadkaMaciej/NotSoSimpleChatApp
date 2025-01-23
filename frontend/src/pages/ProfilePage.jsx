import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Pipette, User } from "lucide-react";

import FormInput from "../components/Form/FormInput";

const ProfilePage = () => {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
	const [selectedColor, setSelectedColor] = useState(authUser.avatarColor || "#ffffff");

	const handleColorChange = async (e) => {
		const color = e.target.value;
		setSelectedColor(color);
		await updateProfile({ avatarColor: color });
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
							<User className="size-40 rounded-full object-cover border-4 text-base-200" style={{ color: selectedColor }} />
							<label
								htmlFor="color-picker"
								className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
							>
								<Pipette className="w-5 h-5 text-base-200" />
								<input
									type="color"
									id="color-picker"
									className="hidden"
									value={selectedColor}
									onChange={handleColorChange}
									disabled={isUpdatingProfile}
								/>
							</label>
						</div>
						<p className="text-sm text-zinc-400">
							{isUpdatingProfile ? "Updating..." : "Click the pipette icon to update your avatar color"}
						</p>
					</div>

					<div className="space-y-6">
						{/* ToDo: Add option to change password */}
						<FormInput type="text" label="Username" placeholder={authUser?.username} icon="user" disabled />
						<FormInput type="text" label="Email Address" placeholder={authUser?.email} icon="mail" disabled />
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
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;