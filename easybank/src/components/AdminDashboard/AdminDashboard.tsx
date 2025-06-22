import { useState } from 'react';
import ClientTable from './ClientTable';
import AdminSidebar from './AdminSidebar';
import TransactionSearch from './TransactionSearch';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [delayedSection, setDelayedSection] = useState<string>('');

  const handleSectionChange = (section: string) => {
    setLoading(true);
    setTimeout(() => {
      setDelayedSection(section);
      setLoading(false);
    }, 500);
  };

  const renderContent = () => {
    switch (delayedSection) {
      case 'usuarios':
        return <ClientTable />;
      case 'transacciones':
        return <TransactionSearch />
        return <p className='italic'>Página no encontrada</p>;
      default:
        return <p className='italic'>Selecciona una opción del menú.</p>;
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar setActiveSection={handleSectionChange} />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto flex justify-center items-center">
        {loading ? (
          <div className="text-center flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Cargando sección...</p>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
