'use client'; // Indica que este es un Componente de Cliente

import React from 'react';

export default function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">¡Error!</h2>
        <p className="text-center text-red-500">Ocurrió un error al cargar la página.</p>
      </div>
    </div>
  );
}
