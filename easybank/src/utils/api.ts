export async function fetchUsersByRole(role: string) {
  const token = localStorage.getItem('token');
  let url = '';

  if (role === 'sysadmin') {
    url = import.meta.env.VITE_URL_ALL_USER;
  } else if (role === 'admin') {
    url = import.meta.env.VITE_URL_CLIENT_USER;
  } else {
    throw new Error('Rol no autorizado');
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error('Error al cargar los usuarios');
  return await response.json();
}

export async function toggleUserStatus(userId: string) {
  const token = localStorage.getItem('token');
  const role = await import('./auth').then(mod => mod.getUserRole());

  if (role !== 'sysadmin') throw new Error('No autorizado');

  const response = await fetch(import.meta.env.VITE_URL_ADMIN_ACTIVE_USER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ _id: userId }),
  });

  if (!response.ok) throw new Error('Error al cambiar el estado del usuario');
}
