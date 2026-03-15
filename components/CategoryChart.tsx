"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Expense } from "@/utils/storage";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
    expenses: Expense[];
}

export default function CategoryChart({ expenses }: CategoryChartProps) {
    const categoryTotals: { [key: string]: number } = {};

    expenses.forEach((expense) => {
        categoryTotals[expense.category] =
            (categoryTotals[expense.category] || 0) + expense.total;
    });

    const labels = Object.keys(categoryTotals);
    const dataValues = Object.values(categoryTotals);

    // Accessible Dark-friendly palette
    const backgroundColors = [
        "#10b981", // emerald-500
        "#3b82f6", // blue-500
        "#f59e0b", // amber-500
        "#ef4444", // rose-500
        "#8b5cf6", // violet-500
        "#ec4899", // pink-500
        "#6b7280", // gray-500
    ];

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: "#18181b", // zinc-900 border matching theme
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    color: "#e4e4e7", // zinc-200
                    font: { size: 12 },
                    padding: 15,
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context: TooltipItem<"pie">) {
                        const value = context.parsed as number;
                        return ` ₹${value.toFixed(2)}`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center">
            <h3 className="text-sm font-semibold text-zinc-400 mb-4 self-start">Spending by Category</h3>
            {labels.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-zinc-500 text-sm">
                    No data to visualize
                </div>
            ) : (
                <div className="w-full h-48 relative flex items-center justify-center">
                    <Pie data={chartData} options={options} />
                </div>
            )}
        </div>
    );
}
