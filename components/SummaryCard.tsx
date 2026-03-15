import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
    color: "emerald" | "blue" | "rose" | "amber";
}

const colorMap = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
};

export default function SummaryCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color,
}: SummaryCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 flex items-start justify-between hover:border-zinc-700 transition-colors"
        >
            <div>
                <p className="text-sm font-medium text-zinc-400">{title}</p>
                <p className="text-2xl font-bold mt-2 text-zinc-100">{value}</p>
                {description && (
                    <p className="text-xs text-zinc-500 mt-1">{description}</p>
                )}
            </div>
            <div className={`p-3 rounded-xl border ${colorMap[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
        </motion.div>
    );
}
