import { LucideIcon } from "lucide-react";
import "./styles/MainCategories.css";

interface Category {
    value: string;
    label: string;
    icon: LucideIcon;
    color: string;
    total: number;
}

interface MainCategoriesProps {
    categories: Category[];
}

export default function MainCategories({ categories }: MainCategoriesProps) {

    return (
        <div className="main-categories">
            <h3 className="main-title">Categorías Principales</h3>

            <div className="categories-grid">
                {categories.map((cat) => (

                    <div key={cat.value} className="category-card">
                        <div className="category-header">
                            <div className={`icon-wrapper`}>
                                <cat.icon className={`icon`} />
                            </div>
                        </div>

                        <p className="category-label">{cat.label}</p>

                        <p className="category-amount">
                            ${cat.total.toLocaleString("es-MX")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
