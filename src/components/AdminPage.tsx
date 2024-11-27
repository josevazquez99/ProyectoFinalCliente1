import { useEffect } from 'react';

const AdminPage = () => {
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('fakeToken') || '{}');
    const currentTime = new Date().getTime();

    // Verificar si el token ha expirado
    if (!token.sub || token.exp < currentTime) {
      // Redirigir al login si el token no existe o ha expirado
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-700">Consola de Administración</h1>
      {/* Aquí puedes agregar la tabla o el contenido de la consola */}
    </div>
  );
};

export default AdminPage;
