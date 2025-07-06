# 💸 Personal Finance Visualizer

A simple web application to track personal expenses, visualize spending, and manage transactions. This project is built with **Next.js**, **MongoDB**, **Recharts**, and **shadcn/ui**.

---

## 🚀 Live Demo

🔗 [(https://personal-finance-visualizer-megm-pqpee50lk-abdul-barrs-projects.vercel.app/)]

🔗 [(https://personal-finance-visualizer-megm-g45l99ahd-abdul-barrs-projects.vercel.app/)]

---

### 🚀 Features

### ✅ Stage 1: Basic Transaction Tracking
- Add, view, and delete transactions
- Store transaction `amount`, `description`, and `date`
- Monthly expenses visualized via bar chart
- Basic validation and error handling

### ✅ Stage 2: Categories & Dashboard
- Categorize each transaction (e.g., Food, Transport, Shopping)
- Pie chart to visualize category-wise expenses
- Dashboard summary:
  - 💰 Total Expenses
  - 🗂️ Category Breakdown
  - 🕒 Most Recent Transaction

### 📱 Responsive UI
- Built using `shadcn/ui` components and Tailwind CSS
- Works across desktop and mobile devices

---

## 🧰 Tech Stack
- **Frontend**: Next.js (App Router), React
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: MongoDB (via Atlas)

---

## 📂 Folder Structure (Simplified)
```
app/
  page.tsx                # Main dashboard UI
  api/
    transactions/
      route.ts            # GET, POST transactions
      [id]/route.ts       # DELETE transaction by ID
lib/
  mongodb.ts              # MongoDB connection utility
```

---

## 🛠️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/personal-finance-visualizer.git
cd personal-finance-visualizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file:
```env
MONGODB_URI=your-mongodb-connection-string
```

### 4. Run the Dev Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🧪 Deployment
Deployed on **Vercel**.
- Push to GitHub → Auto-deploys via Vercel CI
- `.env.local` is ignored via `.gitignore` to keep your database safe

---

## 📌 Notes
- ❌ No authentication/login included (per submission rules)
- ✅ MongoDB URI is environment-based — your live DB is **not affected** by Vercel redeploys

---

## 📅 Coming Next: Stage 3 – Budgeting & Insights
- Set monthly budgets per category
- Compare actual vs budgeted spend
- Smart insights on spending habits

---

## 👨‍💻 Author
Built with ❤️ by Abdul Barr

GitHub: [github.com/abdulbarr730](https://github.com/abdulbarr730)