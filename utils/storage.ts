import { saveReceipt, deleteReceipt } from "./db";
import { encryptData, decryptData } from "./encryption";

export interface Expense {
    id: string;
    date: string; // YYYY-MM-DD
    category: string;
    amount: number; // Base amount entered by user
    description: string;
    gstEnabled: boolean;
    gstRate: number; // E.g., 18
    gstAmount: number;
    subtotal: number; // Amount
    total: number; // Amount + GST
    hasReceipt?: boolean;
    createdAt: string;
}

const STORAGE_KEY = 'expense_zap_data';

export const getExpenses = (): Expense[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    try {
        const decrypted = decryptData(data);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Failed to parse expenses:', error);
        return [];
    }
};

export const saveExpenses = (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;
    const json = JSON.stringify(expenses);
    const encrypted = encryptData(json);
    localStorage.setItem(STORAGE_KEY, encrypted);
};

export const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>, receiptImage?: string): Expense => {
    const expenses = getExpenses();
    const newExpense: Expense = {
        ...expense,
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        hasReceipt: !!receiptImage,
    };
    expenses.push(newExpense);
    saveExpenses(expenses);

    if (receiptImage) {
        saveReceipt(newExpense.id, receiptImage);
    }

    return newExpense;
};

export const deleteExpense = (id: string): void => {
    const expenses = getExpenses();
    const filtered = expenses.filter((e) => e.id !== id);
    saveExpenses(filtered);
    deleteReceipt(id);
};

export const updateExpense = (id: string, updated: Partial<Expense>): void => {
    const expenses = getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updated };
        saveExpenses(expenses);
    }
};

export const calculateTotals = (expenses: Expense[]) => {
    return expenses.reduce(
        (acc, curr) => {
            acc.subtotal += curr.subtotal;
            acc.gstSum += curr.gstAmount;
            acc.totalSum += curr.total;
            return acc;
        },
        { subtotal: 0, gstSum: 0, totalSum: 0 }
    );
};
