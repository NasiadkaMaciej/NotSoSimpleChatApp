import { useState, useEffect } from 'react';

const themes = ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"];

export const useThemeManager = () => {
	const [theme, setTheme] = useState('autumn');

	// Load theme on initial render
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') || 'autumn';
		document.documentElement.setAttribute('data-theme', savedTheme);
		setTheme(savedTheme);
	}, []);

	const handleThemeChange = (newTheme) => {
		document.documentElement.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		setTheme(newTheme);
	};

	return { theme, handleThemeChange, themes };
};