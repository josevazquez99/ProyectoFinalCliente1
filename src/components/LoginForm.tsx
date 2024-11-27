import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el login
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (username === 'admin' && password === 'Abcd1234') {
      // Calcular el tiempo de expiración (15 minutos desde ahora)
      const expirationTime = new Date().getTime() + 15 * 60000;

      const token = {
        sub: '1',
        name: 'admin',
        exp: expirationTime,
      };

      // Guardar el token en localStorage
      localStorage.setItem('fakeToken', JSON.stringify(token));

      // Redirigir a la página de administración
      window.location.href = '/admin';
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
            >
              Acceder
            </button>
          </div>
        </form>

        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
