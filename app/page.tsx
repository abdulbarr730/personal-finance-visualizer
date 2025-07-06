// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#f87171", "#34d399"];
const predefinedCategories = ["Food", "Transport", "Shopping", "Health", "Other"];

type Transaction = {
  _id?: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get("/api/transactions");
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    if (!amount || !description || !date || !category) return;
    await axios.post("/api/transactions", {
      amount,
      description,
      date,
      category,
    });
    setAmount("");
    setDescription("");
    setDate("");
    setCategory("");
    fetchTransactions();
  };

  const deleteTransaction = async (id: string | undefined) => {
    if (!id) return;
    await axios.delete(`/api/transactions/${id}`);
    fetchTransactions();
  };

  type MonthlyTotals = {
    [key: string]: {
      month: string;
      total: number;
    };
  };

  const monthlyData = Object.values(
    transactions.reduce((acc: MonthlyTotals, txn) => {
      const month = new Date(txn.date).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) acc[month] = { month, total: 0 };
      acc[month].total += Number(txn.amount);
      return acc;
    }, {})
  );

  const categoryData = Object.values(
    transactions.reduce((acc: any, txn) => {
      const cat = txn.category || "Uncategorized";
      acc[cat] = acc[cat] || { name: cat, value: 0 };
      acc[cat].value += Number(txn.amount);
      return acc;
    }, {})
  );

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">💸 Personal Finance Dashboard</h1>

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-4">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Category (e.g., Food)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Button onClick={addTransaction}>Add Transaction</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold">
              ₹{transactions.reduce((sum, txn) => sum + Number(txn.amount), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Most Recent</p>
            <p className="text-lg">{transactions[0]?.description || "-"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <ul className="space-y-2">
            {transactions.map((txn) => (
              <li key={txn._id} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{txn.amount} | {txn.category} on {new Date(txn.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Button variant="outline" onClick={() => deleteTransaction(txn._id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
