# 💸 Personal Finance Visualizer

A simple web application to track personal expenses, visualize spending, and manage transactions. This project is built with **Next.js**, **MongoDB**, **Recharts**, and **shadcn/ui**.

---

## 🚀 Live Demo

🔗 [(https://personal-finance-visualizer-megm-pqpee50lk-abdul-barrs-projects.vercel.app/)(https://your-vercel-url.vercel.app)]

---

## 📦 Features (Stage 1)

- Add, view, and delete transactions
- View monthly expenses as a bar chart
- Responsive and modern UI with shadcn/ui
- Basic form validation and clean UX
- Data stored in MongoDB (Atlas)

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [shadcn/ui](https://ui.shadcn.com/), [Recharts](https://recharts.org/)
- **Backend**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Deployment**: [Vercel](https://vercel.com)

---

## 📂 Project Structure

finance-visualizer/
├── app/
│ ├── api/
│ │ └── transactions/
│ │ ├── [id]/route.ts // DELETE transaction
│ │ └── route.ts // GET, POST transactions
│ └── page.tsx // Main UI
├── lib/
│ └── mongodb.ts // MongoDB connection utility
├── .env.local // MongoDB URI (not committed)
├── README.md
