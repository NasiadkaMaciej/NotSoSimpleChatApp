import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Loader } from "lucide-react";
import { Toaster } from 'react-hot-toast';

import NavBar from './components/layout/NavBar';
import ChatPage from './pages/ChatPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ContactsPage from './pages/ContactsPage';
import { useAuthStore } from './store/useAuthStore';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { useChatStore } from './store/useChatStore';
import { useSocket } from './hooks/useSocket';

const NotFoundRedirect = () => {
	const location = useLocation();
	useEffect(() => {
		if (location.pathname !== '/404.php')
			window.location.href = 'https://front.nasiadka.pl/404.php';
	}, [location.pathname]);

	return null;
};

const App = () => {
	const { getUsers, setOnlineUsers, updateMessageStatus } = useChatStore();
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	const socketRef = useRef(null);


	// Check if user is authenticated
	useEffect(() => { checkAuth(); }, [checkAuth]);

	const socketHandlers = {
		newMessage: (message) => {
			useChatStore.getState().handleNewMessage(message);
		},
		getOnlineUsers: setOnlineUsers,
		messageStatusUpdate: updateMessageStatus
	};

	// Initialize socket connection
	useSocket(authUser, socketHandlers, socketRef);

	useEffect(() => {
		if (authUser) getUsers();
	}, [authUser, getUsers]);

	// Animation when checking authentication
	if (isCheckingAuth) return (
		<div className="flex justify-center items-center h-screen" >
			<Loader className="size-10 animate-spin" />
		</div>
	);

	return (
		<div>
			<NavBar />
			<Routes>
				<Route path='/' element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
				<Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
				<Route path='/verify-email' element={<EmailVerificationPage />} /> {/* Ensure this line is present */}
				<Route path='/contacts' element={authUser ? <ContactsPage /> : <Navigate to="/login" />} />
				<Route path="*" element={<NotFoundRedirect />} />
			</Routes>
			<Toaster /> { /* Makes all toasts appear in the app */}
		</div>
	);
}
export default App;