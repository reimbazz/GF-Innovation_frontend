import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InvestmentSummary as SummaryType } from '@/types/investment';
import { TrendingUp, DollarSign, PieChart, Target } from 'lucide-react';

interface InvestmentSummaryProps {
  summary: SummaryType;
}

export const InvestmentSummary = ({ summary }: InvestmentSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total Investido */}
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Investido</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(summary.totalAmount)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantidade de Investimentos */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Investimentos</p>
              <p className="text-2xl font-bold text-foreground">
                {summary.totalInvestments}
              </p>
              <p className="text-xs text-muted-foreground">ativos cadastrados</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Tipo */}
      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Distribuição por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {Object.entries(summary.distributionByType).map(([type, amount]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{type}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {formatPercentage(amount, summary.totalAmount)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};