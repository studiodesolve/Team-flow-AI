const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendWelcomeEmail = async (toEmail, userName) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email send: Email credentials not configured.');
    return;
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">
      <h1 style="color: #1d1d1f; font-size: 32px; letter-spacing: -0.02em; margin-bottom: 24px;">Welcome to TeamFlow.</h1>
      <p style="color: #86868b; font-size: 18px; line-height: 1.5; margin-bottom: 32px;">
        Hi ${userName},<br><br>
        Your account has been created successfully. You're ready to start collaborating.
      </p>
      <a href="http://localhost:5176" style="background-color: #0066cc; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">Go to Dashboard</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"TeamFlow" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Welcome to TeamFlow',
      html: html
    });
    console.log(`Welcome email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendProjectInviteEmail = async (toEmail, projectName, role) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Skipping email send: Email credentials not configured.');
    return;
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; text-align: center;">
      <h1 style="color: #1d1d1f; font-size: 32px; letter-spacing: -0.02em; margin-bottom: 24px;">You've been invited.</h1>
      <p style="color: #86868b; font-size: 18px; line-height: 1.5; margin-bottom: 32px;">
        You have been added to the project <strong>${projectName}</strong> as a <strong>${role}</strong>.
      </p>
      <a href="http://localhost:5176/projects" style="background-color: #0066cc; color: #ffffff; padding: 12px 24px; border-radius: 24px; text-decoration: none; font-weight: 500; font-size: 15px; display: inline-block;">View Project</a>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"TeamFlow" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Invitation to ${projectName}`,
      html: html
    });
    console.log(`Invite email sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending invite email:', error);
  }
};

module.exports = {
  sendWelcomeEmail,
  sendProjectInviteEmail
};
