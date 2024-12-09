'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al registrar el usuario.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Guardamos el token de autenticación
      router.push('/confirmacion'); // Redirigimos a la página de confirmación para verificar el correo
    } catch (error) {
      setError('Hubo un problema al comunicarse con el servidor. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>
        <form onSubmit={handleRegister}>
          {/* Campos del formulario de registro */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 p-2 w-full"
            placeholder="Correo electrónico"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 p-2 w-full"
            placeholder="Nombre"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 p-2 w-full"
            placeholder="Contraseña"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 p-2 w-full"
            placeholder="Confirmar contraseña"
            required
          />
          
          {/* Mostrar errores si ocurren */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md">
            Registrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <a 
              className="text-indigo-600 hover:text-indigo-700"
              onClick={() => router.push('/login')}
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
