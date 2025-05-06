export default function Sidebar() {
    return (
      <aside className="w-64 h-screen bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <nav>
          <ul>
            <li className="mb-2"><a href="#">Inicio</a></li>
            <li><a href="#">Reportes</a></li>
          </ul>
        </nav>
      </aside>
    );
  }