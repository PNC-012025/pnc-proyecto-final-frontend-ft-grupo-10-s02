// src/components/CommandMenu.tsx
import { Command } from 'cmdk';
import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { FiEye, FiLogOut, FiUser, FiCreditCard, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CommandMenu = ({ open, setOpen }: Props) => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  // Atajo Ctrl+K o ⌘+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Comando Global"
      className="fixed inset-0 bg-black/50 z-50"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl border border-gray-300 w-full max-w-lg mx-auto mt-24 overflow-hidden"
      >
        <Command.Input
          value={value}
          onValueChange={setValue}
          placeholder="¿Qué necesitas?"
          className="border-b border-gray-300 p-3 text-base w-full placeholder:text-gray-400 focus:outline-none"
        />
        <Command.List className="p-3">
          <Command.Empty>
            No se encontraron resultados para{' '}
            <span className="text-blue-500">"{value}"</span>
          </Command.Empty>

          <Command.Group heading="Navegación" className="text-sm mb-3 text-gray-400">
            <Command.Item
              onSelect={() => handleNavigate('/usuarios')}
              className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100"
            >
              <FiUser />
              Usuarios
            </Command.Item>
            <Command.Item
              onSelect={() => handleNavigate('/tarjetas')}
              className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100"
            >
              <FiCreditCard />
              Tarjetas
            </Command.Item>
            <Command.Item
              onSelect={() => handleNavigate('/movimientos')}
              className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100"
            >
              <FiActivity />
              Movimientos
            </Command.Item>
          </Command.Group>

          <Command.Group heading="General" className="text-sm text-gray-400 mb-3">
            <Command.Item
              onSelect={() => alert('Viendo la organización')}
              className="flex items-center gap-2 p-2 cursor-pointer rounded hover:bg-gray-100"
            >
              <FiEye />
              Ver Organización
            </Command.Item>
            <Command.Item
              onSelect={() => {
                // lógica de logout aquí si quieres
                navigate('/login');
              }}
              className="flex items-center gap-2 p-2 text-white bg-gray-900 hover:bg-gray-800 rounded cursor-pointer"
            >
              <FiLogOut />
              Cerrar sesión
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
};

export default CommandMenu;
