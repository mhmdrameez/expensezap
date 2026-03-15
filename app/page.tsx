"use client";

import { useState, useEffect } from "react";
import { getExpenses, addExpense, deleteExpense, Expense } from "@/utils/storage";
import { getSavedCurrency, saveCurrency, CURRENCIES, CurrencyConfig, formatAmount } from "@/utils/currency";
import SummaryCard from "@/components/SummaryCard";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import CategoryChart from "@/components/CategoryChart";
import { Plus, IndianRupee, PieChart, Info, Download, Globe } from "lucide-react";
import { exportToCSV, exportToPDF } from "@/utils/export";

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCIES[0]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  useEffect(() => {
    setExpenses(getExpenses());
    setCurrency(getSavedCurrency());
    setLoading(false);
  }, []);

  const handleCurrencyChange = (selected: CurrencyConfig) => {
    setCurrency(selected);
    saveCurrency(selected);
    setShowCurrencyPicker(false);
  };

  const handleAddExpense = (data: Omit<Expense, "id" | "createdAt">, receiptImage?: string) => {
    const newExpense = addExpense(data, receiptImage);
    setExpenses((prev) => [...prev, newExpense]);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.total, 0);
  const totalGst = expenses.reduce((sum, e) => sum + e.gstAmount, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpense = expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading ExpenseZap...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center py-4 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
              <span className="text-emerald-400">Expense</span>Zap
            </h1>
            <p className="text-xs text-zinc-400">Private, Offline Tracker for Indian Freelancers</p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
                className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-2 rounded-xl text-xs border border-zinc-700 transition-colors"
                title="Change Currency"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-semibold">{currency.symbol}</span>
                <span className="hidden sm:inline">{currency.code}</span>
              </button>
              {showCurrencyPicker && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowCurrencyPicker(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl w-64 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-zinc-800">
                      <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider px-2">Select Currency</span>
                    </div>
                    {CURRENCIES.map((c, idx) => (
                      <button
                        key={`${c.code}-${c.country}`}
                        onClick={() => handleCurrencyChange(c)}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 hover:bg-zinc-800/60 transition-colors text-sm ${currency.code === c.code && currency.country === c.country ? "bg-emerald-500/10 text-emerald-400" : "text-zinc-300"
                          }`}
                      >
                        <span className="text-base font-bold w-8 text-center">{c.symbol}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs">{c.code} — {c.name}</div>
                          <div className="text-[10px] text-zinc-500">{c.country} · {c.taxName} ({c.defaultTaxRate}%)</div>
                        </div>
                        {currency.code === c.code && currency.country === c.country && (
                          <span className="text-emerald-400 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => exportToCSV(expenses)}
              disabled={expenses.length === 0}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 px-3 py-2 rounded-xl text-xs border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
            <button
              onClick={() => exportToPDF(expenses, totalExpense, totalGst, currency)}
              disabled={expenses.length === 0}
              className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 px-3 py-2 rounded-xl text-xs border border-zinc-700"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/10 ml-2"
            >
              <Plus className="w-5 h-5" color="black" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Expense"
            value={formatAmount(totalExpense, currency)}
            icon={IndianRupee}
            color="emerald"
            description={`Overall inclusive of ${currency.taxName}`}
          />
          <SummaryCard
            title={`${currency.taxName} Paid`}
            value={formatAmount(totalGst, currency)}
            icon={Info}
            color="amber"
            description="Stored locally"
          />
          <SummaryCard
            title="This Month"
            value={formatAmount(monthlyExpense, currency)}
            icon={PieChart}
            color="blue"
            description={new Date().toLocaleDateString(currency.locale, { month: "long" })}
          />
        </div>

        {/* Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryChart expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} currency={currency} />
          </div>
        </div>

        {/* Add Modal */}
        {isModalOpen && (
          <AddExpenseForm onClose={() => setIsModalOpen(false)} onAdd={handleAddExpense} currency={currency} />
        )}
      </div>
    </main>
  );
}
