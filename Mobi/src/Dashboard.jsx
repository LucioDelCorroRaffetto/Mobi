import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChartCard from '../components/ChartCard';

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-100 min-h-screen">
        <Header />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard />
          <ChartCard />
        </div>
      </main>
    </div>
  );
}