# Health CRUD Application

A full-stack CRUD application for managing health-related data, including Patients, Diseases, Doctors, and more.

## 🚀 Live Application
Visit the live app: [https://your-app-name.onrender.com](https://your-app-name.onrender.com)

---

## 📋 Features
- Create, Read, Update, and Delete (CRUD) operations for multiple entities.
- Database integration with **Supabase** and **Prisma ORM**.
- Responsive design using **Tailwind CSS**.
- Deployed on **Render** for scalable hosting.

---

## 🛠️ Technologies Used
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Render

---

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or later)
- A **Supabase** account and database

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cestlvvies/health-crud-app.git
   cd health-crud-app
2. **Install dependencies**:
   npm install
3. **Set up environment variables**:
Create a .env file in the root directory:
DATABASE_URL=postgresql://username:password@db.supabase.co:5432/your-database
4. **Push Prisma schema to the database**:
   npx prisma db push
5. **Run App locally**:
   npm run dev
   
