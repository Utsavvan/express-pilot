const nodemailer = require("nodemailer");

// Create a transporter with your email service provider's configuration
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Function to send emails with attachments
const sendEmail = async (mailData) => {
  try {
    const mailDataResult = await transporter.sendMail({
      from: process.env.MAIL_FROM_ADDRESS || from,
      ...mailData,
    });

    if (mailDataResult.accepted.length > 0) {
      return {
        success: true,
        data: mailDataResult,
        message: "Mail sent successfully",
      };
    } else {
      return {
        success: false,
        error: "Mail not sent successfully",
      };
    }
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error(error);
  }
};

// Predefined email templates
const emailTemplates = {
  example: {
    subject: "Example subject",
    from: "Example 'from' sentance",
    html: (data) => {
      return `
        <p> Dear User, This is example mail from mail template</p>.
        `;
    },
  },
  otpVerification: {
    subject: "Request for login",
    from: "Login Verification",
    html: (data) => {
      return `
        <p> Dear User,<p> \n</p>Your OTP for login is here <b>${data.OTP}</b></p>.
        `;
    },
  },
};

const getMailTemplate = (key) => {
  return emailTemplates[key];
};

// Function to send predefined template emails
const sendTemplateEmail = async (to, templateKey, data) => {
  try {
    const template = { ...emailTemplates[templateKey] };

    if (!template) {
      console.error("Invalid template key");
      return;
    }

    template["text"] = template["text"] ? template.text(data) : "";

    template["html"] = template["html"] ? template.html(data) : "";

    const updatedTemplate = { to, ...template };

    const mailResult = await sendEmail(updatedTemplate);

    return mailResult;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = {
  sendEmail,
  getMailTemplate,
  sendTemplateEmail,
};
