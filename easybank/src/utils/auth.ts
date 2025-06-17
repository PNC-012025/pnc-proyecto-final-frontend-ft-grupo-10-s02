export async function getUserRole(): Promise<string | null> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(import.meta.env.VITE_URL_LOGIN_ADMIN, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Error al obtener el rol del usuario');
    const data = await response.json();

    if (data.rol === 'user') {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }

    return data.rol;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
