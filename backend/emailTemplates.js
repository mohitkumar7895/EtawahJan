export const serviceApplicationTemplate = (data) => `
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
            <h1>New Service Application</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="field-label">Name</span>
                <div class="field-value">${data.name}</div>
            </div>
            
            <div class="field">
                <span class="field-label">Email</span>
                <div class="field-value">${data.email || 'Not provided'}</div>
            </div>
            
            <div class="field">
                <span class="field-label">Phone</span>
                <div class="field-value">${data.phone}</div>
            </div>
            
            <div class="field">
                <span class="field-label">Service Required</span>
                <div class="field-value">${data.service}</div>
            </div>

            ${data.address ? `
            <div class="field">
                <span class="field-label">Address</span>
                <div class="field-value">${data.address}</div>
            </div>
            ` : ''}

            <div class="footer">
                <p>This is an automated message from Jun Seva Kendra</p>
                <p>📞 Contact: 9193898182</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

export const contactFormTemplate = (data) => `
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