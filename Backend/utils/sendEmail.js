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
    subject: "Your SKIT IoT Inventory Verification Code",

    text: `Your SKIT IoT Inventory verification code is ${otp}. This code will expire in 10 minutes.`,

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>SKIT IoT Inventory</h2>

        <p>Hello,</p>

        <p>
          Use the following verification code to verify your
          SKIT IoT Inventory account:
        </p>

        <h1>${otp}</h1>

        <p>This code will expire in 10 minutes.</p>

        <p>
          If you did not request this code, you can safely ignore
          this email.
        </p>

        <p>Regards,<br>
        SKIT IoT Inventory Team</p>
      </div>
    `,
  });
};

module.exports = sendOTPEmail;