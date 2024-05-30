"use client"

import { CartesianGrid, BarChart, XAxis, YAxis, Legend, Bar, ResponsiveContainer, Tooltip } from "recharts";

export default function EmotionsHistogram({ data, maxDetections }) {
    return (
        <ResponsiveContainer width="80%" height="75%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="0 0" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis ticks={maxDetections} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    itemSorter={{backgroundColor: '#333', color: '#999'}}
                    itemStyle={{backgroundColor: '#transparent', color: '#999'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', 
                                    borderColor: 'transparent',
                                    borderRadius: '5px' }} 
                />
                <Legend />
                <Bar dataKey="Detecciones" fill="#A9A9A9" />
            </BarChart>
        </ResponsiveContainer>
    );
}
