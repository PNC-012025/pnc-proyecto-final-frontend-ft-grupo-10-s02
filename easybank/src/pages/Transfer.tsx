import 'react-big-calendar/lib/css/react-big-calendar.css';

import '../styles/Tranfer.css';
import { useTransitions } from "../hooks/useTransitions";
import { TransactionsTable } from "../components/Transactions/TransactionsTable";
import { PaymentScheduler } from "../components/Schedule/PaymentScheduler";

export const Transfer = () => {

    const { data: transactions = [] } = useTransitions();

    return (
        <>
            <div className="tr-con">
                <TransactionsTable transactions={transactions} />
                <PaymentScheduler />
            </div>

        </>
    );
};
