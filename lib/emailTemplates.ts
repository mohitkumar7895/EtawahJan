export const serviceApplicationTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="format-detection" content="telephone=no">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .alert {
            background-color: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .alert strong {
            color: #1e40af;
            display: block;
            margin-bottom: 5px;
        }
        .field {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        .field-label {
            font-weight: bold;
            color: #1e40af;
            display: block;
            margin-bottom: 8px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .field-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 500;
        }
        .service-badge {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .footer strong {
            color: #1e40af;
        }
        .timestamp {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>नया सेवा आवेदन</h1>
            <p>New Service Application - Jan Seva Kendra</p>
        </div>
        <div class="content">
            <div class="alert">
                <strong>नया आवेदन प्राप्त हुआ</strong>
                कृपया इस आवेदन पर कार्रवाई करें। Please take action on this application.
            </div>
            
            <div class="field">
                <span class="field-label">👤 नाम / Name</span>
                <div class="field-value">${data.name}</div>
            </div>
            
            <div class="field">
                <span class="field-label">📧 ईमेल / Email</span>
                <div class="field-value">${data.email || 'Not provided / प्रदान नहीं किया गया'}</div>
            </div>
            
            <div class="field">
                <span class="field-label">📱 मोबाइल / Mobile</span>
                <div class="field-value">${data.phone}</div>
            </div>
            
            <div class="field">
                <span class="field-label">🛠️ आवश्यक सेवा / Service Required</span>
                <div class="field-value">
                    ${data.service}
                    <div class="service-badge">${data.service}</div>
                </div>
            </div>

            ${data.address ? `
            <div class="field">
                <span class="field-label">📍 पता / Address</span>
                <div class="field-value">${data.address}</div>
            </div>
            ` : ''}

            <div class="timestamp">
                📅 Received at: ${new Date().toLocaleString('en-IN', { 
                    timeZone: 'Asia/Kolkata',
                    dateStyle: 'full',
                    timeStyle: 'long'
                })}
            </div>
        </div>
        <div class="footer">
            <p><strong>Jan Seva Kendra - Etawah</strong></p>
            <p>📞 Contact: <strong>9193898182</strong></p>
            <p>📍 Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP</p>
            <p style="margin-top: 10px; font-size: 12px;">
                This is an automated email. Please respond to the applicant directly.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const contactFormTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-weight: bold;
            color: #4b5563;
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            text-transform: uppercase;
        }
        .field-value {
            font-size: 16px;
            color: #1f2937;
            padding: 10px;
            background-color: #f3f4f6;
            border-radius: 4px;
        }
        .message-box {
            background-color: #f3f4f6;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
        }
        .message-title {
            font-weight: bold;
            color: #4b5563;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 14px;
        }
        .message-content {
            color: #1f2937;
            font-size: 16px;
            line-height: 1.8;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Message</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="field-label">Name</span>
                <div class="field-value">${data.name}</div>
            </div>
            
            <div class="field">
                <span class="field-label">Email</span>
                <div class="field-value">${data.email}</div>
            </div>
            
            <div class="message-box">
                <div class="message-title">Message</div>
                <div class="message-content">${data.message}</div>
            </div>

            <div class="footer">
                <p>This is an automated message from Jun Seva Kendra</p>
                <p>📞 Contact: 9193898182</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// User Confirmation Email Template
export const userConfirmationTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #059669, #10b981);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .success-badge {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
            text-align: center;
        }
        .success-badge strong {
            color: #059669;
            font-size: 18px;
            display: block;
            margin-bottom: 5px;
        }
        .info-box {
            background-color: #f0f9ff;
            border: 1px solid #bae6fd;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info-box h3 {
            color: #0369a1;
            margin-top: 0;
        }
        .field {
            margin-bottom: 15px;
            padding: 12px;
            background-color: #f9fafb;
            border-radius: 6px;
        }
        .field-label {
            font-weight: bold;
            color: #1e40af;
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            text-transform: uppercase;
        }
        .field-value {
            font-size: 16px;
            color: #1f2937;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ आवेदन प्राप्त हुआ</h1>
            <p>Application Received - Jan Seva Kendra</p>
        </div>
        <div class="content">
            <div class="success-badge">
                <strong>🎉 आपका आवेदन सफलतापूर्वक प्राप्त हो गया है!</strong>
                <p style="margin: 5px 0 0 0; color: #065f46;">Your application has been received successfully!</p>
            </div>
            
            <div class="info-box">
                <h3>📋 आवेदन विवरण / Application Details</h3>
                <div class="field">
                    <span class="field-label">👤 नाम / Name</span>
                    <div class="field-value">${data.name}</div>
                </div>
                <div class="field">
                    <span class="field-label">📱 मोबाइल / Mobile</span>
                    <div class="field-value">${data.phone}</div>
                </div>
                <div class="field">
                    <span class="field-label">🛠️ सेवा / Service</span>
                    <div class="field-value">${data.service}</div>
                </div>
            </div>

            <div class="info-box">
                <h3>📞 अगले कदम / Next Steps</h3>
                <p style="margin: 0; color: #1f2937;">
                    हमारी टीम जल्द ही आपसे संपर्क करेगी। कृपया अपना मोबाइल नंबर सक्रिय रखें।<br/>
                    Our team will contact you soon. Please keep your mobile number active.
                </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.jan-seva.site/track" class="button">Track Application Status</a>
            </div>

            <div class="footer">
                <p><strong>Jan Seva Kendra - Etawah</strong></p>
                <p>📞 Contact: <strong>9193898182</strong></p>
                <p>📍 Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP</p>
                <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                    यह एक स्वचालित ईमेल है। कृपया इस ईमेल का जवाब न दें।<br/>
                    This is an automated email. Please do not reply to this email.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// Website Update Notification Template
export const websiteUpdateTemplate = (data: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #7c3aed, #a855f7);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .content {
            padding: 30px;
        }
        .update-badge {
            background-color: #f3e8ff;
            border-left: 4px solid #a855f7;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .update-badge strong {
            color: #7c3aed;
            font-size: 18px;
            display: block;
            margin-bottom: 5px;
        }
        .update-content {
            background-color: #f9fafb;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
        }
        .update-content h3 {
            color: #1e40af;
            margin-top: 0;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 नई अपडेट</h1>
            <p>New Update - Jan Seva Kendra</p>
        </div>
        <div class="content">
            <div class="update-badge">
                <strong>${data.title || 'Website Update'}</strong>
            </div>
            
            <div class="update-content">
                <h3>📢 अपडेट विवरण / Update Details</h3>
                <p style="color: #1f2937; line-height: 1.8;">
                    ${data.message || data.description || 'We have an important update for you.'}
                </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.jan-seva.site" class="button">Visit Website</a>
            </div>

            <div class="footer">
                <p><strong>Jan Seva Kendra - Etawah</strong></p>
                <p>📞 Contact: <strong>9193898182</strong></p>
                <p>📍 Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP</p>
                <p style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
                    यह एक स्वचालित नोटिफिकेशन है।<br/>
                    This is an automated notification.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`;


