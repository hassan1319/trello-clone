# Trello Clone - Task Management App

A modern, responsive task management application built with Next.js 14, TypeScript, and Supabase. This project demonstrates modern full-stack development practices with AI-assisted development.

## ✨ Features

- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Board Management**: Create, edit, and delete boards
- **List & Task Management**: Full CRUD operations for lists and tasks
- **Drag & Drop**: Intuitive drag-and-drop functionality for task management
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live updates across sessions
- **Type Safety**: Built with TypeScript for better development experience
- **Modern UI**: Clean, minimal design with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **State Management**: Zustand
- **Drag & Drop**: @hello-pangea/dnd
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd trello-clone
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your project URL and anon key
4. Go to SQL Editor and run the database setup script (see `database-setup.sql`)

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Database Setup

In your Supabase SQL Editor, execute the SQL commands from `database-setup.sql` to create the necessary tables and Row Level Security policies.

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Tables Structure

```sql
users (Supabase Auth)
├── id (UUID, Primary Key)
├── email (TEXT)
└── created_at (TIMESTAMP)

boards
├── id (UUID, Primary Key)
├── title (TEXT)
├── user_id (UUID, Foreign Key → auth.users.id)
└── created_at (TIMESTAMP)

lists
├── id (UUID, Primary Key)
├── title (TEXT)
├── board_id (UUID, Foreign Key → boards.id)
├── position (INTEGER)
└── created_at (TIMESTAMP)

tasks
├── id (UUID, Primary Key)
├── title (TEXT)
├── description (TEXT, Nullable)
├── list_id (UUID, Foreign Key → lists.id)
├── position (INTEGER)
└── created_at (TIMESTAMP)
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Input Validation**: Zod schemas for form validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Environment Variables**: Secure configuration management

## 🎯 API Documentation

### Authentication Endpoints

All authentication is handled through Supabase Auth:

- **Sign Up**: `POST /auth/signup`
- **Sign In**: `POST /auth/signin`
- **Sign Out**: `POST /auth/signout`

### Data Endpoints

The application uses Supabase client-side SDK for data operations:

- **Boards**: CRUD operations with user isolation
- **Lists**: CRUD operations within user's boards
- **Tasks**: CRUD operations within user's lists

## 🧪 Development with AI Tools

This project was built using AI-assisted development with Claude Code, demonstrating:

- **Rapid Prototyping**: Quick component generation
- **Code Quality**: AI-assisted code reviews and optimizations
- **Best Practices**: Implementation of modern development patterns
- **Type Safety**: Comprehensive TypeScript integration
- **Error Handling**: Robust error management throughout the app

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or deploy directly with Vercel CLI
npm install -g vercel
vercel
```

## 📱 Mobile Experience

The application is fully responsive and provides an excellent mobile experience:

- Touch-friendly drag and drop
- Responsive navigation
- Mobile-optimized modals and forms
- Swipe gestures support

## 🔄 Future Enhancements

- [ ] Real-time collaboration
- [ ] Board sharing and permissions
- [ ] File attachments
- [ ] Due dates and reminders
- [ ] Activity history
- [ ] Dark mode support
- [ ] Board templates

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database and Auth by [Supabase](https://supabase.com)
- UI Components with [Tailwind CSS](https://tailwindcss.com)
- Drag & Drop by [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
- Developed with AI assistance from [Claude](https://claude.ai)
