# 📝 To-Do List App

## 📖 Project Description

The **To-Do List App** is a simple and efficient task management platform built with **Laravel 12**, **React**, **Inertia.js**, and **TypeScript**.  
It provides users with an intuitive interface to create, manage, and organize daily tasks effectively.  
This project focuses on delivering a **smooth and responsive dashboard experience** for productivity tracking.

> [!Warning]  
> This project is **developed exclusively for Light Mode** and **Desktop screen sizes**.  
> Dark mode and mobile responsiveness are **not supported** in this version.

## ✨ Main Features

- **Task Management (CRUD)**  
  Create, view, update, and delete tasks easily through a dynamic React-based interface.

- **Category Management (CRUD)**  
  Organize your tasks by category to keep your workflow structured and efficient.

- **Dashboard Overview**  
  Displays task statistics such as total tasks and progress summaries.

- **Modal-Based Editing**  
  Smooth modal pop-ups for creating or editing tasks and categories without leaving the page.

- **Filtering and Pagination**  
  Quickly find and navigate through tasks with search filters and paginated results.

## 🧰 Tech Stack

- **Backend:** Laravel 12  
- **Frontend:** React + TypeScript + Inertia.js  
- **Styling:** Tailwind CSS  
- **Database:** MySQL  
- **Bundler:** Vite  

## 🚀 Getting Started

### 1. Prerequisites

Make sure you have the following installed on your machine:

- PHP 8.4
- Composer  
- Node.js & npm (or Yarn)  
- MySQL  

### 2. Clone the Repository

```bash
git clone https://github.com/flapzzyyy/mid-webpro-d-2025.git
```

### 3. Navigate to the Project Directory

```bash
cd todo-list-app
```

### 4. Install Dependencies

**Backend (Laravel)**

```bash
composer install
```

**Frontend (React + Vite)**

```bash
npm install
# or
yarn install
```

### 5. Setup Environment

Copy the example environment file and update your credentials:

```bash
cp .env.example .env
```

Generate an application key:

```bash
php artisan key:generate
```

### 6. Run Database Migrations

```bash
php artisan migrate
```

### 7. Run the Development Servers

**Run Laravel backend:**

```bash
php artisan serve
```

**Run React frontend:**

```bash
npm run dev
# or
yarn dev
```

---

## 📄 License

**Copyright © 2025 Yoseph Kevin & Ryan Darmajaya. All rights reserved.**

This project and its contents are protected by copyright law. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without explicit permission from the copyright holder.
