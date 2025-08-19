import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InvestmentSummary } from '@/types/investment';
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface InvestmentChartProps {
  summary: InvestmentSummary;
}

export const InvestmentChart = ({ summary }: InvestmentChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const pieChartData = {
    labels: Object.keys(summary.distributionByType),
    datasets: [
      {
        data: Object.values(summary.distributionByType),
        backgroundColor: [
          'hsl(221, 83%, 53%)', // Primary blue
          'hsl(142, 71%, 45%)', // Success green
          'hsl(262, 83%, 58%)', // Purple
          'hsl(38, 92%, 50%)',  // Warning orange
          'hsl(280, 87%, 65%)', // Pink
        ],
        borderColor: [
          'hsl(221, 83%, 53%)',
          'hsl(142, 71%, 45%)',
          'hsl(262, 83%, 58%)',
          'hsl(38, 92%, 50%)',
          'hsl(280, 87%, 65%)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: Object.keys(summary.distributionByType),
    datasets: [
      {
        label: 'Valor Investido',
        data: Object.values(summary.distributionByType),
        backgroundColor: 'hsl(221, 83%, 53%, 0.8)',
        borderColor: 'hsl(221, 83%, 53%)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.raw;
            return `${context.label}: ${formatCurrency(value)}`;
          },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(value);
          },
        },
      },
    },
  };

  if (Object.keys(summary.distributionByType).length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Gráfico de Pizza */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Distribuição por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Barras */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Valores por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};