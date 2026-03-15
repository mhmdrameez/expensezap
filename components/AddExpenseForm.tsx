"use client";

import { useState, useEffect } from "react";
import { X, Camera, Plus, Trash } from "lucide-react";
import { CurrencyConfig } from "@/utils/currency";

interface AddExpenseFormProps {
    onClose: () => void;
    onAdd: (expense: any, receiptImage?: string) => void;
    currency: CurrencyConfig;
}

export const CATEGORIES = [
    "Software",
    "Hosting",
    "Cloud",
    "Developer Tools",
    "Internet",
    "Mobile",
    "Courses",
    "Books",
    "Certifications",
    "Freelance Fees",
    "Payment Fees",
    "Office Supplies",
    "Coworking",
    "Electricity",
    "Transport",
    "Fuel",
    "Client Meeting",
    "Food",
    "Shopping",
    "Entertainment",
    "Health"
];

export default function AddExpenseForm({ onClose, onAdd, currency }: AddExpenseFormProps) {
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        category: "Food",
        amount: "",
        description: "",
        gstEnabled: true,
        gstRate: currency.defaultTaxRate,
    });
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [receiptImage, setReceiptImage] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("expense_zap_categories");
            const list = saved ? JSON.parse(saved) : CATEGORIES;
            setCategories(list);
            if (list.length > 0 && !formData.category) {
                setFormData((prev) => ({ ...prev, category: list[0] }));
            }
        }
    }, []);

    // Update tax rate when currency changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, gstRate: currency.defaultTaxRate }));
    }, [currency.code]);

    const amountNumber = parseFloat(formData.amount) || 0;
    const gstAmount = formData.gstEnabled
        ? (amountNumber * formData.gstRate) / 100
        : 0;
    const totalAmount = amountNumber + gstAmount;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || !formData.description) return;

        let finalCategory = formData.category;
        if (showNewCategoryInput && newCategoryName.trim()) {
            finalCategory = newCategoryName.trim();
            const updatedCategories = [...categories, finalCategory];
            setCategories(updatedCategories);
            localStorage.setItem("expense_zap_categories", JSON.stringify(updatedCategories));
        }

        onAdd({
            date: formData.date,
            category: finalCategory,
            amount: amountNumber,
            description: formData.description,
            gstEnabled: formData.gstEnabled,
            gstRate: formData.gstRate,
            gstAmount: gstAmount,
            subtotal: amountNumber,
            total: totalAmount,
        }, receiptImage || undefined);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-emerald-400">Add Expense</h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full">
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl p-3 text-zinc-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Category</label>
                        <select
                            value={showNewCategoryInput ? "__NEW__" : formData.category}
                            onChange={(e) => {
                                if (e.target.value === "__NEW__") {
                                    setShowNewCategoryInput(true);
                                    setFormData({ ...formData, category: "" });
                                } else {
                                    setShowNewCategoryInput(false);
                                    setFormData({ ...formData, category: e.target.value });
                                }
                            }}
                            className="w-full bg-[#1e1e2f] border border-[#2a2a3a] rounded-[8px] p-[10px] text-[#e5e7eb] outline-none transition-all"
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat} className="bg-[#1e1e2f] text-[#e5e7eb]">
                                    {cat}
                                </option>
                            ))}
                            <option value="__NEW__" className="bg-[#1e1e2f] text-emerald-400 font-bold">+ Add Category</option>
                        </select>
                        {showNewCategoryInput && (
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-full bg-zinc-800/50 border border-emerald-500/30 rounded-xl p-3 text-zinc-100 mt-2 focus:border-emerald-500"
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Amount (Excl. {currency.taxName})</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl p-3 text-zinc-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-1">Description / Notes</label>
                        <textarea
                            placeholder="What was this for?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl p-3 text-zinc-100"
                            rows={2}
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl">
                        <span className="text-sm text-zinc-300">Include {currency.taxName}</span>
                        <input
                            type="checkbox"
                            checked={formData.gstEnabled}
                            onChange={(e) => setFormData({ ...formData, gstEnabled: e.target.checked })}
                            className="accent-emerald-400"
                        />
                    </div>

                    {formData.gstEnabled && (
                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-xs text-zinc-400 mb-1">{currency.taxName} Rate (%)</label>
                                <input
                                    type="number"
                                    value={formData.gstRate}
                                    onChange={(e) => setFormData({ ...formData, gstRate: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl p-2 text-zinc-100"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs text-zinc-400 mb-1">{currency.taxName} Amount</label>
                                <div className="p-2 border border-dashed border-zinc-700 rounded-xl text-center bg-zinc-800/20 text-emerald-400 font-medium">
                                    {currency.symbol}{gstAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-3 bg-zinc-800/40 rounded-xl">
                        <div className="text-xs text-zinc-500">Totals</div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-sm text-zinc-400">Subtotal: {currency.symbol}{amountNumber.toFixed(2)}</span>
                            <span className="text-lg font-bold text-zinc-100">Total: {currency.symbol}{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-zinc-400 mb-2">Receipt (Optional)</label>
                        <div className="flex gap-3 items-center">
                            <label className="flex items-center cursor-pointer gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-sm border border-zinc-700">
                                <Camera className="w-4 h-4" />
                                Capture
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <label className="flex items-center cursor-pointer gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-xl text-sm border border-zinc-700">
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {receiptImage && (
                            <div className="mt-3 relative inline-block">
                                <img src={receiptImage} className="h-24 w-auto rounded-xl border border-zinc-700" />
                                <button
                                    type="button"
                                    onClick={() => setReceiptImage(null)}
                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1"
                                >
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold p-3 rounded-xl flex items-center justify-center gap-2 mt-4"
                    >
                        <Plus className="w-5 h-5" color="black" />
                        Save Expense
                    </button>
                </form>
            </div>
        </div>
    );
}
