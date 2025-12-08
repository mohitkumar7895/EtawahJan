# Jan Seva Kendra - Next.js Application

This is a Next.js application for Jan Seva Kendra service center.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `components/` - React components
- `lib/` - Utility functions and API client
- `models/` - MongoDB models
- `admin/` - Admin panel components

## Features

- Service application forms
- Contact forms
- Vacancy management
- Admin panel for managing vacancies

## Build

```bash
npm run build
npm start
```







