'use client'; // Asegura que este componente se ejecute en el cliente

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const [confirmationCode, setConfirmationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter(); // Usamos router para redirigir al usuario

  const handleInputChange = (e, index) => {
    const value = e.target.value;

    // Asegura que solo se puedan ingresar números
    if (value.match(/[^0-9]/)) return;

    const newCode = [...confirmationCode];
    newCode[index] = value;
    setConfirmationCode(newCode);

    // Mover al siguiente campo automáticamente si se llena el campo actual
    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();

    // Validamos que todos los campos estén llenos
    if (confirmationCode.includes('')) {
      setError('Por favor, ingresa todo el código de confirmación.');
      return;
    }

    const code = confirmationCode.join(''); // Convertimos el array a un string

    // Obtener el token de autenticación de localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('No estás autenticado. Inicia sesión para continuar.');
      return;
    }

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Asegúrate de que el token esté aquí
        },
        body: JSON.stringify({ code }),  // Enviar el código de confirmación como parte del cuerpo
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.error === 'Invalid confirmation code.') {
          setError('El código de confirmación es inválido. Por favor, revisa tu correo.');
        } else {
          setError('Error al confirmar el correo. Intenta nuevamente.');
        }
        return;
      }

      const data = await response.json();
      if (data.acknowledged && data.modifiedCount > 0) {
        setSuccessMessage('Correo confirmado exitosamente. Ahora puedes iniciar sesión.');
        setTimeout(() => {
          router.push('/login'); // Redirige al login después de la confirmación
        }, 3000);
      } else {
        setError('Hubo un problema al confirmar el correo.');
      }
    } catch (error) {
      setError('Hubo un problema al comunicarse con el servidor. Intenta nuevamente.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Confirmación de correo</h2>
        <form onSubmit={handleConfirm}>
          <div className="mb-4 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Código de confirmación</label>
            <div className="flex justify-between gap-2">
              {confirmationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(e, index)}
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              ))}
            </div>
          </div>

          {/* Mostrar errores o mensajes de éxito */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded-md">Confirmar</button>
        </form>

      </div>
    </div>
  );
}
