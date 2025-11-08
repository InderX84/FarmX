import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

export const sendRequestNotification = async (adminEmail, request, mod, user) => {
  const subject = `New Paid Mod Request - ${mod.title}`;
  const html = `
    <h2>New Paid Mod Request</h2>
    <p><strong>User:</strong> ${user.username} (${user.email})</p>
    <p><strong>Mod:</strong> ${mod.title}</p>
    <p><strong>Price:</strong> $${mod.price}</p>
    <p><strong>Message:</strong> ${request.message}</p>
    <p><strong>Request Date:</strong> ${new Date(request.createdAt).toLocaleDateString()}</p>
    <p>Please log in to the admin dashboard to manage this request.</p>
  `;
  
  await sendEmail(adminEmail, subject, html);
};