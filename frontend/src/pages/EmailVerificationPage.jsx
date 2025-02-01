import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import FormLayout from '../components/auth/FormLayout';
import { api } from '../services/api';

const EmailVerificationPage = () => {
	const [searchParams] = useSearchParams();
	const [status, setStatus] = useState('verifying');
	const navigate = useNavigate();

	useEffect(() => {
		const verifyEmail = async () => {
			const token = searchParams.get('token');
			try {
				await api.auth.verifyEmail(token);
				setStatus('success');
				setTimeout(() => navigate('/login'), 3000);
			} catch (error) {
				setStatus('error');
			}
		};
		verifyEmail();
	}, [searchParams, navigate]);

	return (
		<FormLayout
			title="Email Verification"
			subtitle={
				status === 'verifying' ? 'Verifying your email...' :
					status === 'success' ? 'Email verified successfully!' :
						'Verification failed'
			}
		>
			<div className="flex flex-col items-center justify-center gap-4">
				{status === 'verifying' && <Loader className="w-8 h-8 animate-spin" />}
				{status === 'success' && (
					<div className="text-center">
						<p className="text-success">Redirecting to login page...</p>
					</div>
				)}
				{status === 'error' && (
					<div className="text-center">
						<p className="text-error">Invalid or expired verification link.</p>
						<button
							className="btn btn-primary mt-4"
							onClick={() => navigate('/login')}
						>
							Go to Login
						</button>
					</div>
				)}
			</div>
		</FormLayout>
	);
};

export default EmailVerificationPage;