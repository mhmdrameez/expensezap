"use client";

import { useState } from "react";
import { Expense } from "@/utils/storage";
import { CurrencyConfig } from "@/utils/currency";
import { Trash, Calendar, ArrowUpDown, Receipt, Eye, X, Download } from "lucide-react";
import { getReceipt } from "@/utils/db";

interface ExpenseListProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    currency: CurrencyConfig;
}

export default function ExpenseList({ expenses, onDelete, currency }: ExpenseListProps) {
    const [sortKey, setSortKey] = useState<"date" | "category" | "total">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);

    const handleViewReceipt = (id: string) => {
        const img = getReceipt(id);
        if (img) {
            setViewingReceipt(img);
        } else {
            alert("Receipt not found.");
        }
    };

    const sortedExpenses = [...expenses].sort((a, b) => {
        let comparison = 0;
        if (sortKey === "date") {
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortKey === "category") {
            comparison = a.category.localeCompare(b.category);
        } else if (sortKey === "total") {
            comparison = a.total - b.total;
        }
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const toggleSort = (key: typeof sortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortOrder("desc");
        }
    };

    const sym = currency.symbol;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-emerald-400" /> Recent Expenses
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => toggleSort("date")}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border ${sortKey === "date" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                            }`}
                    >
                        Date <ArrowUpDown className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => toggleSort("category")}
                        className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border ${sortKey === "category" ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                            }`}
                    >
                        Category <ArrowUpDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {sortedExpenses.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 text-sm">
                    No expenses recorded yet. Click &quot;+&quot; to add one.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm text-zinc-300">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-400">
                                    <th className="pb-3 font-medium">Date</th>
                                    <th className="pb-3 font-medium">Category</th>
                                    <th className="pb-3 font-medium">Description</th>
                                    <th className="pb-3 font-medium text-right">Subtotal</th>
                                    <th className="pb-3 font-medium text-right">{currency.taxName}</th>
                                    <th className="pb-3 font-medium text-right">Total</th>
                                    <th className="pb-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {sortedExpenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="py-3 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                            {new Date(expense.date).toLocaleDateString(currency.locale)}
                                        </td>
                                        <td className="py-3">
                                            <span className="bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md text-xs border border-zinc-700">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="py-3 truncate max-w-xs">{expense.description}</td>
                                        <td className="py-3 text-right">{sym}{expense.subtotal.toFixed(2)}</td>
                                        <td className="py-3 text-right text-emerald-400">
                                            {sym}{expense.gstAmount.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right font-bold text-zinc-100">
                                            {sym}{expense.total.toFixed(2)}
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                {expense.hasReceipt && (
                                                    <button
                                                        onClick={() => handleViewReceipt(expense.id)}
                                                        className="p-1.5 hover:bg-emerald-500/10 rounded-lg group text-zinc-500 hover:text-emerald-400"
                                                        title="View Receipt"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onDelete(expense.id)}
                                                    className="p-1.5 hover:bg-rose-500/10 rounded-lg group text-zinc-500 hover:text-rose-400"
                                                    title="Delete"
                                                >
                                                    <Trash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {sortedExpenses.map((expense) => (
                            <div key={expense.id} className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-4 relative">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(expense.date).toLocaleDateString(currency.locale)}
                                        </div>
                                        <div className="font-semibold text-zinc-100 mt-1">{expense.description}</div>
                                        <div className="mt-1 flex items-center gap-1">
                                            <span className="bg-zinc-800/80 text-zinc-300 px-1.5 py-0.5 rounded text-[10px] border border-zinc-700">
                                                {expense.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-zinc-100">{sym}{expense.total.toFixed(2)}</div>
                                        {expense.gstEnabled && (
                                            <div className="text-[10px] text-emerald-400">{currency.taxName}: {sym}{expense.gstAmount.toFixed(2)}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute bottom-3 right-3 flex gap-1">
                                    {expense.hasReceipt && (
                                        <button
                                            onClick={() => handleViewReceipt(expense.id)}
                                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-emerald-400 border border-zinc-700/50"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(expense.id)}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg text-rose-400"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Receipt Image Viewer Modal */}
            {viewingReceipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setViewingReceipt(null)}
                >
                    <div
                        className="relative bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl w-[90vw] max-w-[640px] mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
                            <span className="text-sm font-semibold text-zinc-200 tracking-tight">Receipt Preview</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        const a = document.createElement("a");
                                        a.href = viewingReceipt;
                                        a.download = `Receipt_${Date.now()}.png`;
                                        a.click();
                                    }}
                                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                                    title="Download"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewingReceipt(null)}
                                    className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                                    title="Close"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="border border-zinc-800 rounded-md bg-zinc-900/50 flex items-center justify-center overflow-hidden"
                                style={{ height: "420px" }}
                            >
                                <img
                                    src={viewingReceipt}
                                    alt="Receipt"
                                    className="max-h-full max-w-full object-contain select-none"
                                    draggable={false}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
