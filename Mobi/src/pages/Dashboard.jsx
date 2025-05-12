import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChartCard from '../components/ChartCard';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    propiedades: { total: 0, cambio: 0 },
    usuarios: { total: 0, cambio: 0 },
    ventas: { total: 0, cambio: 0 },
    alquileres: { total: 0, cambio: 0 }
  });

  const [propiedadesPorMes, setPropiedadesPorMes] = useState([]);
  const [usuariosPorMes, setUsuariosPorMes] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener estadísticas generales
        const statsResponse = await axios.get('/api/dashboard/stats');
        setStats(statsResponse.data);

        // Obtener datos de propiedades por mes
        const propiedadesResponse = await axios.get('/api/dashboard/propiedades-por-mes');
        setPropiedadesPorMes(propiedadesResponse.data);

        // Obtener datos de usuarios por mes
        const usuariosResponse = await axios.get('/api/dashboard/usuarios-por-mes');
        setUsuariosPorMes(usuariosResponse.data);

        // Obtener actividad reciente
        const actividadResponse = await axios.get('/api/dashboard/actividad-reciente');
        setActividadReciente(actividadResponse.data);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <Header />
        <div className="p-6">
          {/* Resumen de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Propiedades Totales</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.propiedades.total}</p>
              <span className={`text-sm ${stats.propiedades.cambio >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.propiedades.cambio >= 0 ? '↑' : '↓'} {Math.abs(stats.propiedades.cambio)}%
              </span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Usuarios Registrados</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.usuarios.total}</p>
              <span className={`text-sm ${stats.usuarios.cambio >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.usuarios.cambio >= 0 ? '↑' : '↓'} {Math.abs(stats.usuarios.cambio)}%
              </span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Ventas Realizadas</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.ventas.total}</p>
              <span className={`text-sm ${stats.ventas.cambio >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.ventas.cambio >= 0 ? '↑' : '↓'} {Math.abs(stats.ventas.cambio)}%
              </span>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-gray-500 text-sm font-medium">Alquileres Activos</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stats.alquileres.total}</p>
              <span className={`text-sm ${stats.alquileres.cambio >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.alquileres.cambio >= 0 ? '↑' : '↓'} {Math.abs(stats.alquileres.cambio)}%
              </span>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ChartCard 
              title="Propiedades por Mes" 
              data={propiedadesPorMes}
              color="#4F46E5"
              height={350}
            />
            <ChartCard 
              title="Usuarios Registrados" 
              data={usuariosPorMes}
              color="#10B981"
              height={350}
            />
          </div>

          {/* Tabla de Actividad Reciente */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-medium text-gray-800">Actividad Reciente</h3>
            </div>
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 text-sm">
                    <th className="pb-4 font-medium">Usuario</th>
                    <th className="pb-4 font-medium">Acción</th>
                    <th className="pb-4 font-medium">Fecha</th>
                    <th className="pb-4 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {actividadReciente.map((actividad, index) => (
                    <tr key={index} className="border-t border-gray-100">
                      <td className="py-4 text-gray-700">{actividad.usuario}</td>
                      <td className="py-4 text-gray-700">{actividad.accion}</td>
                      <td className="py-4 text-gray-700">{actividad.fecha}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          actividad.estado === 'Completado' 
                            ? 'bg-green-50 text-green-700'
                            : actividad.estado === 'En proceso'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {actividad.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
