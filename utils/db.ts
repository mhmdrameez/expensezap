const RECEIPT_PREFIX = 'expense_zap_receipt_';

export const saveReceipt = (expenseId: string, imageBase64: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${RECEIPT_PREFIX}${expenseId}`, imageBase64);
};

export const getReceipt = (expenseId: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(`${RECEIPT_PREFIX}${expenseId}`);
};

export const deleteReceipt = (expenseId: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${RECEIPT_PREFIX}${expenseId}`);
};
