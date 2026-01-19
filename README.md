# Elite Estates | Premium Real Estate Investment Platform

A high-end, production-ready real estate investment digital showroom and inventory management system. Designed for single-admin operation where properties are acquired, renovated, and resold.

## 🌟 Key Features

- **Premium UI/UX**: Luxury design aesthetic with smooth Framer Motion animations and Inter/Playfair Display typography.
- **Advanced Inventory System**: Secure admin dashboard for managing property lifecycles (Acquired → For Sale → Sold).
- **Investment Analytics**: Automatic calculation of Profit and ROI % for every property in the portfolio.
- **Intelligent Search & Filtering**: Real-time property discovery for visitors with dynamic filters generated from inventory data.
- **Secure Admin Access**: Email-restricted authentication protecting all management routes and data operations.
- **Optimized Performance**: Built with Next.js App Router for fast loading and SEO-friendly structure.

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, React Icons.
- **Backend**: Firebase Realtime Database (Free Tier optimized).
- **Auth**: Firebase Authentication.
- **Styling**: Modern CSS with luxury design tokens and glassmorphism effects.

## 🚀 Getting Started

### 1. Firebase Setup
1. Create a new project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** and activate the **Email/Password** provider.
3. Enable **Realtime Database** and set the location.
4. Go to Project Settings and create a new **Web App** to get your configuration object.

### 2. Configuration
Create a `.env.local` file in the root directory (use `env.template` as a guide):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

# Admin Email (Only this email can access admin panel)
NEXT_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Security Rules
Set the following rules in your Firebase Realtime Database:

```json
{
  "rules": {
    "properties": {
      ".read": true,
      ".write": "auth != null && auth.token.email === 'admin@yourdomain.com'"
    }
  }
}
```

### 4. Installation & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## 🔒 Security Notes
- The admin dashboard is protected at the routing level (Next.js), UI level (React Context), and Database level (Firebase Rules).
- Only the email defined in `NEXT_PUBLIC_ADMIN_EMAIL` can perform write operations.
- Images are compressed client-side before storage to respect free-tier database limits.

## 📈 Deployment
This project is optimized for deployment on **Vercel**. Simply connect your repository and add the environment variables in the Vercel dashboard.

---
*Developed with excellence for the premium real estate market.*
