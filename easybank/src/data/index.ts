import {
    PiggyBank,
    Utensils,
    Home,
    Wallet,
    Gamepad2,
    HeartPulse,
    BadgeDollarSign,
    LucideIcon,
} from "lucide-react";

type CategoriesType = {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
}

export const categories: CategoriesType[] = [
    { value: "1", label: "Ahorros", icon: PiggyBank, color: "text-green-600" },
    { value: "2", label: "Comida", icon: Utensils, color: "text-orange-600" },
    { value: "3", label: "Hogar", icon: Home, color: "text-blue-600" },
    { value: "4", label: "Gastos varios", icon: Wallet, color: "text-gray-600" },
    { value: "5", label: "Ocio", icon: Gamepad2, color: "text-purple-600" },
    { value: "6", label: "Salud", icon: HeartPulse, color: "text-red-600" },
    { value: "7", label: "Suscripciones", icon: BadgeDollarSign, color: "text-yellow-600" },
];
