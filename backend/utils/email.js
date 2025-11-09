import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'indermehra622@gmail.com',
    pass: 'glodayjiejtxlmwf'
  }
});

export const sendPurchaseRequest = async (modDetails, buyerDetails, providerEmail) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: providerEmail,
    subject: `Purchase Request for ${modDetails.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Purchase Request</h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Mod Details</h3>
          <p><strong>Name:</strong> ${modDetails.title}</p>
          <p><strong>Price:</strong> ₹${modDetails.price}</p>
          <p><strong>Description:</strong> ${modDetails.description}</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Buyer Information</h3>
          <p><strong>Name:</strong> ${buyerDetails.username}</p>
          <p><strong>Email:</strong> ${buyerDetails.email}</p>
          <p><strong>Message:</strong> ${buyerDetails.message}</p>
        </div>
        
        <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #166534;">
            <strong>Next Steps:</strong> Please contact the buyer directly to arrange payment and delivery.
          </p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px;">
          This email was sent from 2 Fast Ale mod marketplace.<br>
          Visit: <a href="${process.env.CLIENT_URL}" style="color: #16a34a;">2 Fast Ale</a>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendRequestNotification = async (adminEmail, request, mod, user) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `New Mod Request: ${mod.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">New Mod Request</h2>
        <p><strong>User:</strong> ${user.username} (${user.email})</p>
        <p><strong>Mod:</strong> ${mod.title}</p>
        <p><strong>Message:</strong> ${request.message}</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendModStatusNotification = async (userEmail, modTitle, status, username) => {
  const statusColors = {
    approved: '#16a34a',
    rejected: '#dc2626'
  };
  
  const statusMessages = {
    approved: 'Your mod has been approved and is now live on 2 Fast Ale!',
    rejected: 'Your mod submission has been rejected. Please review our guidelines and try again.'
  };

  const mailOptions = {
    from: 'indermehra622@gmail.com',
    to: userEmail,
    subject: `Mod ${status === 'approved' ? 'Approved' : 'Rejected'} - ${modTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${statusColors[status]}; text-align: center;">Mod ${status === 'approved' ? 'Approved' : 'Rejected'}</h2>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 20px;">Hi ${username},</h3>
          <p style="color: #6b7280; margin-bottom: 20px;">${statusMessages[status]}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColors[status]}; margin: 20px 0;">
            <h4 style="color: #374151; margin: 0 0 10px 0;">Mod: ${modTitle}</h4>
            <p style="color: ${statusColors[status]}; font-weight: bold; margin: 0;">Status: ${status.toUpperCase()}</p>
          </div>
          
          ${status === 'approved' ? `
            <a href="${process.env.CLIENT_URL}/mods" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
              View Your Mod
            </a>
          ` : ''}
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Visit: <a href="${process.env.CLIENT_URL}" style="color: #16a34a;">2 Fast Ale</a>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendOTPEmail = async (email, otp, username) => {
  const mailOptions = {
    from: 'indermehra622@gmail.com',
    to: email,
    subject: 'Verify Your Email - 2 Fast Ale',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a; text-align: center;">Welcome to 2 Fast Ale!</h2>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 20px;">Hi ${username},</h3>
          <p style="color: #6b7280; margin-bottom: 30px;">Please verify your email address to complete your registration.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border: 2px dashed #16a34a; margin: 20px 0;">
            <h1 style="color: #16a34a; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
          </div>
          
          <p style="color: #ef4444; font-size: 14px; margin-top: 20px;">This OTP will expire in 10 minutes.</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          If you didn't create an account, please ignore this email.<br>
          Visit: <a href="${process.env.CLIENT_URL}" style="color: #16a34a;">2 Fast Ale</a>
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};