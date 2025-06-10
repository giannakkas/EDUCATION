  const transporter = require('../config/email');

  exports.sendVerificationEmail = async (email, name, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification - Educational Platform',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Thank you for registering on our educational platform.</p>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>Educational Platform Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  };

  exports.sendPasswordResetEmail = async (email, name, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset - Educational Platform',
      html: `
        <h1>Hello ${name},</h1>
        <p>You requested a password reset for your account.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy and paste this link in your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>Educational Platform Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  };

  exports.sendWelcomeEmail = async (email, name, role) => {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Educational Platform!',
      html: `
        <h1>Welcome ${name}!</h1>
        <p>Your account has been successfully verified.</p>
        ${role === 'teacher' ? `
          <p>As a teacher, you've received <strong>50 free credits</strong> to get started!</p>
          <p>You can use these credits to generate AI-powered lessons for your classes.</p>
        ` : `
          <p>As a student, you have free access to all your enrolled classes and lessons.</p>
        `}
        <p>Get started by logging into your dashboard.</p>
        <p>Best regards,<br>Educational Platform Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
  };
