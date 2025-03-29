import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DataReportChart = ({ reportData, chartType }) => {
  const labels = reportData.map((data) => data.label);
  const values = reportData.map((data) => data.value);

  const data = {
    labels,
    datasets: [
      {
        label: 'Report Data',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Data Report Chart',
      },
    },
  };

  return (
    <div>
      {chartType === 'bar' && <Bar data={data} options={options} />}
      {chartType === 'pie' && <Pie data={data} options={options} />}
    </div>
  );
};

export default DataReportChart;