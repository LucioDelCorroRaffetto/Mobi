import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartCard({ 
  title = 'Ventas Mensuales', 
  data = [], 
  dataKey = 'value',
  color = '#8884d8',
  height = 300
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-4 text-gray-700">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              tick={{ fill: '#666' }}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}