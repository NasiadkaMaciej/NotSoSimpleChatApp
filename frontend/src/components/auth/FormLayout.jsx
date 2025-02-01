import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const FormLayout = ({ title, subtitle, children, linkText, linkTo, linkDescription }) => {
	return (
		<div className="h-screen flex flex-col justify-center items-center p-4">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center mb-8">
					<div className="flex flex-col items-center gap-2 group">
						<div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
							<MessageSquare className="size-6 text-primary" />
						</div>
						<h1 className="text-2xl font-bold mt-2">{title}</h1>
						<p className="text-base-content/60">{subtitle}</p>
					</div>
				</div>
				{children}
				<div className="text-center">
					<p className="text-base-content/60">
						{linkDescription}{" "}
						<Link to={linkTo} className="link link-primary">
							{linkText}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default FormLayout;