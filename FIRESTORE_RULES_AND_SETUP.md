# Lebanon Buyers - Firestore Setup Guide

This guide explains how to configure your database security and structure.

## 1. Security Rules
I have created a dedicated file in your project root called:
👉 **`firestore.rules`**

### How to apply them:
1.  Open the `firestore.rules` file in your code editor.
2.  **CRITICAL:** Change `'info@lebanonbuyers.com'` to your actual admin email.
3.  Copy the entire content of that file.
4.  Go to your [Firebase Console](https://console.firebase.google.com/).
5.  Navigate to **Firestore Database** > **Rules** tab.
6.  Delete everything there and paste the new rules.
7.  Click **Publish**.

## 2. What these rules cover:
*   **Properties**: Publicly viewable, but only you (Admin) can add/edit/delete.
*   **Website Content**: Publicly viewable, but only you can change the homepage/about/contact text via the admin panel.
*   **Inquiries**: Anyone can send you a message through the contact form, but only you can read them.
*   **Comments**: Ready for future use (Public read, User create, Admin moderate).
*   **Security**: Everything else is locked down by default.

## 3. Database Structure
The admin panel expects these documents in the `content` collection:
*   `homepage`: Hero text and advantages.
*   `about`: About page story and stats.
*   `contact`: Contact details and address.
*   `footer`: Footer description and social links.
*   `metadata`: Property types and amenities lists.

You can initialize these easily by going to **Platform Settings** in your admin dashboard (`/adminofthepage/settings`) and clicking **Save** on each tab.

## 4. Admin Access
*   **Admin Dashboard**: `/adminofthepage`
*   **Login Page**: `/login`
*   **Environment Variable**: Ensure `NEXT_PUBLIC_ADMIN_EMAIL` in your `.env.local` matches the email in your rules.
