import nodemailer from 'nodemailer';

 export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  
  tls: {
    rejectUnauthorized: false, // This is required for Gmail sometimes
  },
});


