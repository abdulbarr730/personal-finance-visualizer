"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: "", description: "", date: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get("/api/transactions");
    setTransactions(res.data);
  };

  const addTransaction = async () => {
    if (!form.amount || !form.date || !form.description) return;
    await axios.post("/api/transactions", form);
    setForm({ amount: "", description: "", date: "" });
    fetchTransactions();
  };

  const deleteTransaction = async (id: string) => {
    await axios.delete(`/api/transactions/${id}`);
    fetchTransactions();
  };

  const dataForChart = Object.values(
    transactions.reduce((acc, txn) => {
      const month = new Date(txn.date).toLocaleString("default", { month: "short" });
      acc[month] = acc[month] || { month, total: 0 };
      acc[month].total += Number(txn.amount);
      return acc;
    }, {})
  );

  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <Card>
        <CardContent className="p-4 space-y-2">
          <Input
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Button onClick={addTransaction}>Add Transaction</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-bold mb-2">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataForChart}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-bold">All Transactions</h2>
          {transactions.map((txn) => (
            <div key={txn._id} className="flex justify-between items-center border-b py-1">
              <div>
                ₹{txn.amount} — {txn.description} ({new Date(txn.date).toLocaleDateString()})
              </div>
              <Button size="sm" variant="outline" onClick={() => deleteTransaction(txn._id)}>
                Delete
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
