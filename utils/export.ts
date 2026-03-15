import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Expense } from "./storage";
import { CurrencyConfig, getSavedCurrency } from "./currency";

export const exportToCSV = (expenses: Expense[]) => {
    if (expenses.length === 0) return;
    const currency = getSavedCurrency();

    const headers = ["Date", "Category", "Description", "Subtotal", `${currency.taxName}`, "Total"];
    const rows = expenses.map((e) => [
        new Date(e.date).toLocaleDateString(currency.locale),
        e.category,
        e.description,
        `${currency.symbol}${e.subtotal.toFixed(2)}`,
        `${currency.symbol}${e.gstAmount.toFixed(2)}`,
        `${currency.symbol}${e.total.toFixed(2)}`,
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((val) => `"${val}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ExpenseZap_Report_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper to get a symbol that is safe for jsPDF standard fonts (which lack full Unicode support)
const getSafePdfSymbol = (cur: CurrencyConfig) => {
    if (cur.code === "INR") return "Rs. ";
    // Standard ASCII symbols that work in Helvetic/Times
    if (["$", "£"].includes(cur.symbol)) return cur.symbol;
    // For others like €, ¥, ₹ etc that might fail, we return empty so the code handles it
    return "";
};

export const exportToPDF = (expenses: Expense[], totalExpense: number, totalGst: number, currency?: CurrencyConfig) => {
    if (expenses.length === 0) return;
    const cur = currency || getSavedCurrency();
    const safeSymbol = getSafePdfSymbol(cur);

    const doc = new jsPDF();

    // Style config
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text("ExpenseZap Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString(cur.locale);
    doc.text(`Generated on: ${dateStr}`, 14, 28);

    // Summary section
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Total Expenses: ${cur.code} ${safeSymbol}${totalExpense.toFixed(2)}`, 14, 40);
    doc.text(`Total ${cur.taxName} Paid: ${cur.code} ${safeSymbol}${totalGst.toFixed(2)}`, 14, 48);

    // Table
    const tableHeaders = [["Date", "Category", "Description", "Subtotal", cur.taxName, "Total"]];
    const tableData = expenses.map((e) => [
        new Date(e.date).toLocaleDateString(cur.locale),
        e.category,
        e.description,
        `${safeSymbol}${e.subtotal.toFixed(2)}`,
        `${safeSymbol}${e.gstAmount.toFixed(2)}`,
        `${safeSymbol}${e.total.toFixed(2)}`,
    ]);

    autoTable(doc, {
        startY: 55,
        head: tableHeaders,
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [16, 185, 129] }, // emerald theme
        styles: { fontSize: 9 },
    });

    // Export
    doc.save(`ExpenseZap_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
