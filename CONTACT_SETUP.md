# Contact Us Page Setup Guide

## 📋 Overview
Complete Contact Us page implementation for AI Trip Planner with:
- Modern responsive design with Tailwind CSS
- Form validation and error handling
- Email sending via Resend/Nodemailer
- Convex database integration
- Toast notifications
- Loading states and animations

## 🚀 Features Implemented

### 1. Contact Page UI (`app/contact-us/page.tsx`)
- ✅ Professional two-column layout
- ✅ Contact form with validation
- ✅ Contact information sidebar
- ✅ Responsive design with dark mode support
- ✅ Loading states and animations
- ✅ Toast notifications for success/error

### 2. Backend API (`app/api/contact/route.ts`)
- ✅ Form validation (required fields, email format, message length)
- ✅ Email sending integration
- ✅ Error handling with typed responses
- ✅ Rate limiting ready

### 3. Database Integration (`convex/messages.ts`)
- ✅ Convex schema updated with messages table
- ✅ Message storage mutation
- ✅ TypeScript support

### 4. Email Service (`lib/email.ts`)
- ✅ Resend integration (recommended for Vercel)
- ✅ Nodemailer fallback option
- ✅ Professional HTML email templates
- ✅ Environment variable configuration

### 5. UI Components
- ✅ Input component (`components/ui/input.tsx`)
- ✅ Textarea component (updated)
- ✅ Toast component (`components/ui/toast.tsx`)
- ✅ Button component (existing)

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
# For Resend (recommended)
npm install resend

# OR for Nodemailer
npm install nodemailer @types/nodemailer
```

### 2. Environment Variables
Add to your `.env.local`:
```env
# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=support@aitripplanner.com

# Alternative: SMTP for Nodemailer
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
```

### 3. Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Add to environment variables

### 4. Update Convex Schema
Run to push schema changes:
```bash
npx convex dev
```

## 🎨 Design Features

### Layout
- **Left Side**: Contact form with modern card design
- **Right Side**: Contact information and feature highlights
- **Responsive**: Mobile-first design that works on all devices

### Form Fields
- Full Name (required)
- Email Address (required, validated)
- Subject (required)
- Message (required, min 10 characters)

### Contact Information
- Support Email: support@aitripplanner.com
- Location: New Delhi, India
- Support: 24/7 Online Support

### Visual Elements
- Gradient backgrounds
- Shadow cards
- Icon integration (Lucide React)
- Hover animations
- Loading spinners

## 🔧 Customization

### Change Email Template
Edit `lib/email.ts` to modify the HTML email template.

### Update Contact Information
Modify the contact info section in `app/contact-us/page.tsx`.

### Styling
All styles use Tailwind CSS classes and can be customized in the component files.

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
```env
RESEND_API_KEY=your_production_resend_key
ADMIN_EMAIL=support@yourdomain.com
CONVEX_DEPLOYMENT=prod:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## 📱 Testing

### Local Testing
1. Start development server: `npm run dev`
2. Navigate to `/contact-us`
3. Fill out and submit form
4. Check console for email logs
5. Verify Convex database entries

### Production Testing
1. Deploy to Vercel
2. Test form submission
3. Check email delivery
4. Verify database storage

## 🔍 Troubleshooting

### Common Issues
1. **Email not sending**: Check API key and environment variables
2. **Form not submitting**: Check network tab for API errors
3. **Database errors**: Verify Convex schema is pushed
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Steps
1. Check browser console for errors
2. Verify API route responses
3. Check Convex dashboard for data
4. Test email service separately

## 📊 Analytics & Monitoring

### Track Form Submissions
- Add analytics events in form submission handler
- Monitor success/error rates
- Track popular inquiry subjects

### Performance
- Form loads instantly
- Optimized images and icons
- Minimal JavaScript bundle

## 🔒 Security Features

### Implemented
- Input validation and sanitization
- Email format validation
- Message length limits
- Error handling without exposing internals

### Recommended Additions
- Rate limiting (can use Arcjet)
- CAPTCHA for spam prevention
- Input sanitization for XSS prevention

## 📈 Future Enhancements

### Potential Additions
- File upload support
- Live chat integration
- FAQ section
- Contact form analytics
- Auto-responder emails
- Multi-language support

## 🎯 Success Metrics
- Form completion rate
- Response time to inquiries
- User satisfaction scores
- Email delivery rates

---

**Status**: ✅ Production Ready
**Last Updated**: December 2024
**Version**: 1.0.0