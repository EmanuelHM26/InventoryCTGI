import React from "react";

const Help = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Centro de Ayuda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Preguntas frecuentes */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Preguntas Frecuentes</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">¿Cómo restablezco mi contraseña?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Puedes restablecer tu contraseña yendo a la página de inicio de sesión y haciendo clic en "¿Olvidaste tu contraseña?".
                También puedes cambiarla desde la sección de Ajustes en tu perfil.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">¿Cómo actualizo mi información de perfil?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Ve a la sección "Mi Perfil" y haz clic en el botón "Editar Perfil". Allí podrás modificar tu información personal.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700">¿Cómo contacto al soporte técnico?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Puedes contactarnos por correo electrónico a soporte@sistema.com o llamarnos al +1 (555) 123-4567 de lunes a viernes de 9 AM a 6 PM.
              </p>
            </div>
          </div>
        </div>
        
        {/* Contacto */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto de Soporte</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Correo electrónico</h4>
                <p className="text-sm text-gray-600">soporte@sistema.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Teléfono</h4>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-700">Soporte en línea</h4>
                <p className="text-sm text-gray-600">Disponible 24/7 a través del chat</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-2">Horario de atención</h4>
            <p className="text-sm text-gray-600">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
            <p className="text-sm text-gray-600">Sábados: 10:00 AM - 2:00 PM</p>
            <p className="text-sm text-gray-600">Domingos: Cerrado</p>
          </div>
        </div>
      </div>
      
      {/* Documentación */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentación y Recursos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">Manual de usuario</span>
          </a>
          
          <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">Politicas de seguridad</span>
          </a>
          
          <a href="#" className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-gray-700">Preguntas técnicas</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;