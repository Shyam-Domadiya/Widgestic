import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                Not enough data to display chart yet.
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 400, backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem' }}>Performance Trends (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
                        }}
                    />
                    <YAxis
                        stroke="#64748b"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: 'white' }}
                        itemStyle={{ color: 'white' }}
                        labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line type="monotone" dataKey="views" name="Impressions" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} dot={false} />
                    <Line type="monotone" dataKey="clicks" name="Interactions" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="dismissals" name="Dismissals" stroke="#ef4444" strokeWidth={3} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
