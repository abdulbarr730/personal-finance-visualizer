"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
type Transaction = {
  _id?: string;
  amount: number;
  description: string;
  date: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  // ✅ Fetch transactions on load
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get("/api/transactions");
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    if (!amount || !description || !date) return;
    await axios.post("/api/transactions", {
      amount,
      description,
      date,
    });
    setAmount("");
    setDescription("");
    setDate("");
    fetchTransactions();
  };

  const deleteTransaction = async (id: string | undefined) => {
    if (!id) return;
    await axios.delete(`/api/transactions/${id}`);
    fetchTransactions();
  };

  // ✅ Group transactions by month for the bar chart
  type MonthlyTotals = {
    [key: string]: {
      month: string;
      total: number;
    };
  };

  const dataForChart = Object.values(
    transactions.reduce((acc: MonthlyTotals, txn) => {
      const month = new Date(txn.date).toLocaleString("default", {
        month: "short",
      });
      if (!acc[month]) {
        acc[month] = { month, total: 0 };
      }
      acc[month].total += Number(txn.amount);
      return acc;
    }, {})
  );

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">💸 Personal Finance Tracker</h1>

      {/* Transaction Form */}
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
          <Button onClick={addTransaction}>Add Transaction</Button>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <ul className="space-y-2">
            {transactions.map((txn) => (
              <li
                key={txn._id}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p className="font-medium">{txn.description}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{txn.amount} on{" "}
                    {new Date(txn.date).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => deleteTransaction(txn._id)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Monthly Bar Chart */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataForChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
