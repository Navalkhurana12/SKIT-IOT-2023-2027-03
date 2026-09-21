const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"SKIT IoT Inventory" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "SKIT IoT Inventory - Email Verification",
    html: `
      <h2>SKIT IoT Inventory</h2>
      <p>Your email verification OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
    `,
  });
};

module.exports = sendOTPEmail;