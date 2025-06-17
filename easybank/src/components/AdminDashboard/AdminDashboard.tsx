import { useState } from 'react';
import AdminSidebar from '../components/AdminSideBar/AdminSideBar';
import ClientTable from '../components/AdminDashboard/ClientTable';
import CardTable from '../components/AdminDashboard/CardTable';
import TransactionTable from '../components/AdminDashboard/TransactionTable';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<string>('usuarios');

  const renderContent = () => {
    switch (activeSection) {
      case 'usuarios':
        return <ClientTable />;
      case 'tarjetas':
        return <CardTable />;
      case 'movimientos':
        return <TransactionTable />;
      default:
        return <p>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="flex">
      <AdminSidebar setActiveSection={setActiveSection} />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
