const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

/**
 * @desc    Send contact form email
 * @route   POST /api/contact
 * @access  Public (with rate limiting)
 */
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Create transporter based on environment
    let transporter;

    if (process.env.EMAIL_SERVICE === "gmail") {
      // Gmail configuration
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Generic SMTP configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }

    // Verify transporter configuration
    await transporter.verify();

    // Email to company
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || "contact@interviu.fr",
      replyTo: email,
      subject: `[InterviU Contact] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
              }
              .header {
                background: linear-gradient(135deg, #5639fe, #66e8fd);
                color: white;
                padding: 20px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: bold;
                color: #5639fe;
                display: block;
                margin-bottom: 5px;
              }
              .message-box {
                background: #f5f7fa;
                padding: 15px;
                border-left: 4px solid #5639fe;
                margin-top: 10px;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                color: #718096;
                font-size: 12px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">From:</span>
                  <p>${name}</p>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <p><a href="mailto:${email}">${email}</a></p>
                </div>
                <div class="field">
                  <span class="label">Subject:</span>
                  <p>${subject}</p>
                </div>
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="message-box">
                    ${message.replace(/\n/g, "<br>")}
                  </div>
                </div>
                <div class="footer">
                  <p>This email was sent from the InterviU contact form</p>
                  <p>Reply directly to ${email} to respond</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    logger.info(`Contact form email sent: ${info.messageId} from ${email}`);

    // Auto-reply to sender (optional)
    const autoReplyOptions = {
      from: `"InterviU Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thank you for contacting InterviU",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #5639fe, #66e8fd);
                color: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
              }
              .content {
                padding: 30px 0;
              }
              .footer {
                text-align: center;
                color: #718096;
                font-size: 12px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Contacting Us!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>We've received your message and will get back to you as soon as possible, usually within 24-48 hours.</p>
                <p><strong>Your message:</strong></p>
                <p style="background: #f5f7fa; padding: 15px; border-radius: 5px; border-left: 4px solid #5639fe;">
                  ${message.replace(/\n/g, "<br>")}
                </p>
                <p>If you have any urgent questions, feel free to reply to this email.</p>
                <p>Best regards,<br>The InterviU Team</p>
              </div>
              <div class="footer">
                <p>InterviU - Ace Your Next Interview</p>
                <p>contact@interviu.fr</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send auto-reply (don't wait for it, don't fail if it doesn't send)
    transporter.sendMail(autoReplyOptions).catch((error) => {
      logger.warn(`Auto-reply email failed: ${error.message}`);
    });

    res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. We'll get back to you soon!",
    });
  } catch (error) {
    logger.error(`Contact form error: ${error.message}`);

    // Provide helpful error messages
    if (error.message.includes("Invalid login")) {
      return res.status(500).json({
        success: false,
        error:
          "Email service configuration error. Please contact the administrator.",
      });
    }

    res.status(500).json({
      success: false,
      error:
        "Failed to send message. Please try again later or email us directly at contact@interviu.fr",
    });
  }
};


