export const serviceApplicationTemplate = (data: any) => `
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
            <h1>🔔 नया सेवा आवेदन</h1>
            <p>New Service Application - Jan Seva Kendra</p>
        </div>
        <div class="content">
            <div class="alert">
                <strong>⚠️ IMPORTANT - नया आवेदन प्राप्त हुआ!</strong>
                कृपया इस आवेदन पर तुरंत कार्रवाई करें। Please take immediate action on this application.
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


