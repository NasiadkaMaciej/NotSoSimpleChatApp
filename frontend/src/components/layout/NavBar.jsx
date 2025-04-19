import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, User, LogOut, Sun, Users } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useThemeManager } from "../../hooks/useThemeManager";

const Navbar = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { logout, authUser } = useAuthStore();
	const setSelectedUser = useChatStore((state) => state.setSelectedUser);
	const { handleThemeChange, themes } = useThemeManager();

	// Close dropdown when clicked outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const renderThemePreview = (themeName) => (
		<div className="flex items-center justify-center w-16 h-8 rounded-lg bg-base" data-theme={themeName}>
			{["primary", "secondary", "accent", "neutral"].map((color, i) => (
				<div key={i} className={`size-3 rounded-full bg-${color} mx-0.5`} data-theme={themeName}></div>
			))}
		</div>
	);

	return (
		<header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-50 backdrop-blur-lg bg-base-100/80">
			<div className="container mx-auto px-4 h-16">
				<div className="flex items-center justify-between h-full">
					<div className="flex items-center gap-8">
						<Link
							to="/"
							onClick={() => setSelectedUser(null)}
							className="flex items-center gap-2.5 hover:opacity-80 transition-all btn btn-ghost"
						>
							<div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
								<MessageSquare className="size-5 text-primary" />
							</div>
							<h1 className="text-lg font-bold">Simple Chat App</h1>
						</Link>
					</div>

					<div className="flex items-center gap-2">
						<div className="relative">
							<button className="btn btn-sm gap-2" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
								<Sun className="size-5" />
								<span className="hidden sm:inline">Themes</span>
							</button>
							{isDropdownOpen && (
								<ul
									className="absolute right-0 mt-2 w-48 bg-base-100 shadow-lg rounded-lg py-2 z-50 max-h-80 overflow-y-auto"
									ref={dropdownRef}
								>
									{themes.map((themeName) => (
										<li
											key={themeName}
											className="px-4 py-2 hover:bg-base-200 cursor-pointer flex items-center justify-between"
											onClick={() => {
												handleThemeChange(themeName);
												setIsDropdownOpen(false);
											}}
										>
											<span>{themeName.charAt(0).toUpperCase() + themeName.slice(1)}</span>
											{renderThemePreview(themeName)}
										</li>
									))}
								</ul>
							)}
						</div>
						{authUser && (
							<>
								<Link to="/contacts" className="btn btn-sm gap-2">
									<Users className="size-5" />
									<span className="hidden sm:inline">Contacts</span>
								</Link>
								<Link to="/profile" className="btn btn-sm gap-2">
									<User className="size-5" />
									<span className="hidden sm:inline">Profile</span>
								</Link>
								<button className="btn btn-sm flex gap-2 items-center" onClick={logout}>
									<LogOut className="size-5" />
									<span className="hidden sm:inline">Logout</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
