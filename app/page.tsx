"use client";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  useEffect,
  useState
} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const categories = ["Food", "Transport", "Shopping", "Utilities", "Others"];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"];

type Transaction = {
  _id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
};

type Budget = {
  _id: string;
  category: string;
  month: string;
  amount: number;
};

export default function Home() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState("");
  const [transactions, setTransactions] = useState < Transaction[] > ([]);
  const [budgets, setBudgets] = useState < Budget[] > ([]);
  const [budgetInputs, setBudgetInputs] = useState(() =>
    categories.reduce((acc, cat) => {
      acc[cat] = "";
      return acc;
    }, {} as Record < string, string > )
  );

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  };

  const fetchBudgets = async () => {
    const res = await fetch("/api/budgets");
    const data = await res.json();
    setBudgets(data);
  };

  const handleAddTransaction = async () => {
    if (!amount || !description || !date) return;

    await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify({
        amount,
        description,
        date,
        category
      }),
    });
    setAmount("");
    setDescription("");
    setDate("");
    fetchTransactions();
  };

  const handleDeleteTransaction = async (id: string) => {
    await fetch(`/api/transactions/${id}`, {
      method: "DELETE",
    });
    fetchTransactions();
  };

  const handleSetBudget = async (cat: string) => {
    const month = new Date().toLocaleString("default", {
      month: "short"
    });

    const existing = budgets.find((b) => b.category === cat && b.month === month);

    if (existing) {
      await fetch(`/api/budgets/${existing._id}`, {
        method: "PUT",
        body: JSON.stringify({
          amount: budgetInputs[cat]
        }),
      });
    } else {
      await fetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify({
          category: cat,
          amount: budgetInputs[cat],
          month,
        }),
      });
    }

    fetchBudgets();
  };

  const handleDeleteBudget = async (id: string) => {
    await fetch(`/api/budgets/${id}`, {
      method: "DELETE",
    });
    fetchBudgets();
  };

  const monthlyData = Object.values(
    transactions.reduce((acc, txn) => {
      const month = new Date(txn.date).toLocaleString("default", {
        month: "short"
      });
      acc[month] = acc[month] || {
        month,
        total: 0
      };
      acc[month].total += Number(txn.amount);
      return acc;
    }, {} as Record < string, {
      month: string;
      total: number;
    }>)
  );

  const categoryData = categories.map((cat, i) => ({
    name: cat,
    value: transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0),
  }));

  const budgetVsActual = categories.map((cat) => {
    const actual = transactions
      .filter((t) => t.category === cat)
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const month = new Date().toLocaleString("default", {
      month: "short"
    });
    const budget = budgets.find((b) => b.category === cat && b.month === month)?.amount || 0;

    return {
      category: cat,
      actual,
      budget
    };
  });

  return (
    <main className="max-w-3xl mx-auto space-y-6 p-4">
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-xl font-bold">Add Transaction</h2>
          <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTransaction}>Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-bold mb-2">Monthly Expenses</h2>
          <BarChart width={400} height={200} data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-bold mb-2">Category Breakdown</h2>
          <PieChart width={400} height={250}>
            <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-bold">Budgets</h2>
          {categories.map((cat) => {
            const budget = budgets.find((b) => b.category === cat);
            return (
              <div key={cat} className="flex items-center gap-2">
                <span className="w-24">{cat}</span>
                <Input
                  type="number"
                  placeholder="Set budget"
                  value={budgetInputs[cat]}
                  onChange={(e) =>
                    setBudgetInputs((prev) => ({ ...prev, [cat]: e.target.value }))
                  }
                />
                <Button size="sm" onClick={() => handleSetBudget(cat)}>Save</Button>
                {budget && (
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteBudget(budget._id)}>
                    Delete
                  </Button>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="font-bold mb-2">Budget vs Actual</h2>
          <BarChart width={400} height={200} data={budgetVsActual}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="actual" fill="#8884d8" />
            <Bar dataKey="budget" fill="#82ca9d" />
          </BarChart>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-bold">Transactions</h2>
          {transactions.map((t) => (
            <div key={t._id} className="flex justify-between">
              <span>
                ₹{t.amount} - {t.description} ({t.category}) [{t.date}]
              </span>
              <Button variant="ghost" onClick={() => handleDeleteTransaction(t._id)}>🗑️</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
