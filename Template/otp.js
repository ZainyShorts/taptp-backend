function otpTemplate(name, otp,) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            background-color: #F4F4F4;
            color: #333333;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #FFFFFF;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }
        .logo-container {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo-container img {
            width: 100px;
            height: auto;
        }
        .section {
            text-align: center;
            margin-top: 20px;
            padding: 20px;
        }
        .section h1 {
            font-size: 24px;
            color: #1A202C;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .section p {
            font-size: 16px;
            color: #4A5568;
            margin-top: 12px;
        }
        .otp-code {
            font-size: 32px;
            color: #2D3748;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 20px;
            letter-spacing: 5px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 14px;
            color: #718096;
        }
        .footer a {
            color: #3182CE;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Brand Logo -->
        <div class="logo-container">
            <img src="https://res.cloudinary.com/dlasb4krd/image/upload/v1732954505/vbj0runbfx39cca5cqf7.png" alt="Brand Logo">
        </div>

        <!-- OTP Details -->
        <div class="section">
            <h1>Hello, ${name}</h1>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <p class="otp-code">${otp}</p>
            <p>Please use this OTP to complete your process. This code will expire in 10 minutes.</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; 2024 www.taptap.com. All rights reserved.</p>
            <p>Need help? Contact us at <a href="mailto:support@yourbrand.com">support@taptap.com</a></p>
        </div>
    </div>
</body>
</html>
    `;
}

module.exports = {
    otpTemplate
};
