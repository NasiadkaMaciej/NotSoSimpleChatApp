import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = nodemailer.createTransport({
	host: 'smtp.sendgrid.net',
	port: 587,
	auth: {
		user: "apikey",
		pass: process.env.SENDGRID_API_KEY
	}
})

// ToDo: Maybe some react generated page form dist?

export const sendVerificationEmail = async (email, token) => {
	const verificationUrl = `https://front.nasiadka.pl/verify-email/?token=${token}`;
	const mailOptions = {
		from: 'maciej@nasiadka.pl',
		to: email,
		subject: 'Email Verification',
		text: ``,
		html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 5% auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .header {
                        font-size: 24px;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    p {
                        font-size: 16px;
                        color: #333;
                        margin: 10px 0;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    a:hover {
                        background-color: #0056b3;
                    }
                    .footer {
                        margin-top: 20px;
                        font-size: 12px;
                        color: #777;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">Email Verification</div>
                    <p>Please verify your email by clicking the link below:</p>
                    <a target="_blank" href="${verificationUrl}">Verify Email</a>
                    <p>If the link isn't displayed properly, copy it to your browser: <br> ${verificationUrl}</p>
                    <p class="footer">If you didn't create an account, you can safely ignore this email.</p>
                </div>
            </body>
            </html>`
	};

	// PRODUCTION
	// ToDo: Uncomment this line before deploying
	await transporter.sendMail(mailOptions);
};