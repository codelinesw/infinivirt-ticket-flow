import React, { useState } from 'react';
import { Search, BookOpen, MessageSquare, ExternalLink, HelpCircle, FileText } from 'lucide-react';

export const HelpCenter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const articles = [
    {
      id: '1',
      title: 'Configuración de Webhooks y Claves API',
      category: 'Integraciones',
      readTime: '4 min lectura',
      summary: 'Guía paso a paso para generar tokens bearer y registrar URLs de recepción de eventos.',
    },
    {
      id: '2',
      title: 'Políticas de SLA y Tiempos de Respuesta',
      category: 'SLA & Soporte',
      readTime: '3 min lectura',
      summary: 'Conoce los tiempos garantizados de primera respuesta según el nivel de prioridad del ticket.',
    },
    {
      id: '3',
      title: 'Gestión de Permisos y Roles de Usuario (RBAC)',
      category: 'Administración',
      readTime: '5 min lectura',
      summary: 'Diferencias entre los roles ADMIN, SUPERVISOR, AGENT y CLIENT dentro de la plataforma.',
    },
  ];

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className="rounded-2xl bg-[#FE9501] p-8 text-white shadow-xl">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">¿En qué podemos ayudarte hoy?</h1>
          <p className="text-xs text-indigo-200">
            Explora nuestra base de conocimiento o busca soluciones a problemas comunes.
          </p>

          <div className="relative pt-2">
            <Search className="absolute left-4 top-5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artículos, guías de API o errores comunes..."
              className="w-full rounded-xl border-0 bg-white py-3 pl-11 pr-4 text-xs text-slate-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-dark-400"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-600" /> Artículos Recomendados
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600 mb-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5">{article.category}</span>
                  <span className="text-slate-400">{article.readTime}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
                <p className="mt-2 text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                Leer artículo <ExternalLink className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};