import React, { useState } from "react";

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "¿Cómo restablezco mi contraseña?",
      answer: "Puedes restablecer tu contraseña yendo a la página de inicio de sesión y haciendo clic en '¿Olvidaste tu contraseña?'. También puedes cambiarla desde la sección de Ajustes en tu perfil."
    },
    {
      id: 2,
      question: "¿Cómo actualizo mi información de perfil?",
      answer: "Ve a la sección 'Mi Perfil' y haz clic en el botón 'Editar Perfil'. Allí podrás modificar tu información personal como nombre y correo electrónico."
    },
    {
      id: 3,
      question: "¿Cómo contacto al soporte técnico?",
      answer: "Puedes contactarnos por correo electrónico a soporte@sistema.com o llamarnos al +1 (555) 123-4567 de lunes a viernes de 9 AM a 6 PM."
    },
    {
      id: 4,
      question: "¿Cómo gestiono el inventario?",
      answer: "Accede a la sección de Inventario desde el menú principal. Allí podrás agregar, editar o eliminar elementos del inventario de forma sencilla."
    }
  ];

  const contactMethods = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Correo electrónico",
      value: "soporte@sistema.com",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Teléfono",
      value: "+1 (555) 123-4567",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Chat en línea",
      value: "Disponible 24/7",
      color: "bg-purple-100 text-purple-600"
    }
  ];

  const resources = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Manual de usuario",
      description: "Guía completa del sistema",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Políticas de seguridad",
      description: "Protección y privacidad",
      color: "from-green-500 to-green-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "Preguntas técnicas",
      description: "Solución de problemas",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Ayuda</h1>
          <p className="text-gray-500 mt-2">¿En qué podemos ayudarte hoy?</p>
        </div>

        {/* Búsqueda rápida */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Preguntas Frecuentes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Preguntas Frecuentes</h3>
                  <p className="text-sm text-gray-500">Las respuestas más buscadas</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-semibold text-gray-900 text-left">{faq.question}</h4>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ml-3 ${
                          expandedFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 bg-gray-50">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">¿No encuentras lo que buscas?</span> Contacta a nuestro equipo de soporte para obtener ayuda personalizada.
                </p>
              </div>
            </div>
          </div>

          {/* Contacto de Soporte */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-5">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Contacto</h3>
              </div>
              
              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-start">
                      <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center flex-shrink-0 mr-3`}>
                        {method.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm">{method.title}</h4>
                        <p className="text-sm text-gray-600 mt-0.5 break-words">{method.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-sm p-6 text-white">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-bold text-lg">Horario de atención</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-green-400/30">
                  <span className="font-medium">Lunes - Viernes</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-400/30">
                  <span className="font-medium">Sábados</span>
                  <span>10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Domingos</span>
                  <span className="opacity-75">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recursos */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Documentación y Recursos</h3>
              <p className="text-sm text-gray-500">Accede a guías y materiales de apoyo</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <button
                key={index}
                className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {resource.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1 text-left">{resource.title}</h4>
                <p className="text-sm text-gray-600 text-left">{resource.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;