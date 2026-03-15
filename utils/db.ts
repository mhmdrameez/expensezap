import { encryptData, decryptData } from "./encryption";

const RECEIPT_PREFIX = 'expense_zap_receipt_';

export const saveReceipt = (expenseId: string, imageBase64: string): void => {
    if (typeof window === 'undefined') return;
    const encrypted = encryptData(imageBase64);
    localStorage.setItem(`${RECEIPT_PREFIX}${expenseId}`, encrypted);
};

export const getReceipt = (expenseId: string): string | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(`${RECEIPT_PREFIX}${expenseId}`);
    if (!data) return null;
    return decryptData(data);
};

export const deleteReceipt = (expenseId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${RECEIPT_PREFIX}${expenseId}`);
};
