import Quizsubmission from "../Models/quizsubmission.js";
import nodemailer from 'nodemailer'

import { Email, emailPassword } from "../host/index.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Email,
        pass: emailPassword,
    },
});
export const shopQuizSubmissions = async (req, res) => {
    try {
        const { shopID, quizID } = req.body;

        // Find all rescue bags for the specified restaurant
        const shopQuizSubmissions = await Quizsubmission.find({ shopID: shopID, quizID: quizID });

        return res.status(200).json({
            status: true,
            message: 'Shop quiz submission retrived successfully ',
            data: shopQuizSubmissions,
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Something went wrong in the backend',
            error: error.message,
        });
    }
};

export const sendResultsEmail = async (request, response) => {
    try {
        const { email, products } = request.body;

        if (!email) {
            return response.status(400).json({
                status: false,
                message: "No Email entered",
            });
        }

        // Ensure image URLs are fully qualified
        const productHTML = products.map(product => {
            let imageUrl = product.imageUrl;
            if (imageUrl.startsWith('//')) {
                imageUrl = 'https:' + imageUrl;
            }

            return `
            <div style="padding: 10px; vertical-align: top; width: 250px; cursor: pointer;" onclick="window.location.href='${product.url}';">
            <div style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); width: 250px; height: 300px;">
                        <img src="${imageUrl}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.onerror=null;this.src='https://via.placeholder.com/300x200';">
                        <div style="padding: 10px;">
                            <h2 style="font-size: 18px; color: #333; margin: 0 0 3px 0; height: 50px; overflow: hidden;">${product.title}</h2>
                            <p style="margin: 0; padding: 0; font-size: 16px; color: #555;">Price: ${product.price}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Full HTML content
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>Hello,</p>
                <p>Thank you for using Vacuum Finder. Here are the results:</p>
                <div style="max-width:100%; overflow-y:hidden; display: flex; flex-direction: row; flex-wrap: wrap; background-color: white; justify-content: space-between; align-items: center; padding: 10px 25px;  ;">
                ${productHTML}
                </div>
                <p>If you didn't request this email, please ignore it.</p>
                <p>Best regards,<br>Vacuum Finder Team</p>
            </div>
        `;

        // Email sending 
        const mailOptions = {
            from: Email,
            to: email,
            subject: "Vacuum Finder Results",
            html: htmlContent,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return response.status(500).json({ message: "Failed to send email" });
            } else {
                console.log("Email sent:", info.response);
                response.json({
                    status: true,
                    message: 'Email sent successfully',
                });
            }
        });

    } catch (error) {
        console.error('Error sending email: ', error);
        response.status(500).json({
            status: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
};
