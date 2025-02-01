import { Facebook, Mail } from "lucide-react";
import { toast } from "react-hot-toast";

const SocialLogin = () => {
	const handleSocialLogin = (provider) => {
		toast.error(`${provider} login not implemented yet`);
	};

	return (
		<>
			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-base-300"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-base-100 text-base-content/60">OR</span>
				</div>
			</div>

			<div className="space-y-3">
				<button
					type="button"
					onClick={() => handleSocialLogin("Facebook")}
					className="btn btn-outline w-full gap-2"
				>
					<Facebook className="h-5 w-5 text-blue-600" />
					Continue with Facebook
				</button>
				<button
					type="button"
					onClick={() => handleSocialLogin("Google")}
					className="btn btn-outline w-full gap-2"
				>
					<Mail className="h-5 w-5 text-red-500" />
					Continue with Google
				</button>
			</div>
		</>
	);
};

export default SocialLogin;