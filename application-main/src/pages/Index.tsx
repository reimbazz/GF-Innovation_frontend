import { useInvestments } from '@/hooks/useInvestments';
import { InvestmentForm } from '@/components/investment/InvestmentForm';
import { InvestmentTable } from '@/components/investment/InvestmentTable';
import { InvestmentSummary } from '@/components/investment/InvestmentSummary';
import { InvestmentChart } from '@/components/investment/InvestmentChart';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { investments, loading, createInvestment, updateInvestment, deleteInvestment, getSummary } = useInvestments();
  const summary = getSummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Controle de Investimentos</h1>
          </div>
          <p className="text-center text-blue-100 text-lg">
            Gerencie seus investimentos de forma inteligente e organizada
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <InvestmentSummary summary={summary} />

        {/* Charts */}
        {investments.length > 0 && <InvestmentChart summary={summary} />}

        {/* Form and Table Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investment Form */}
          <div className="lg:col-span-1">
            <InvestmentForm onSubmit={createInvestment} />
          </div>

          {/* Investment Table */}
          <div className="lg:col-span-2">
            <InvestmentTable
              investments={investments}
              onEdit={updateInvestment}
              onDelete={deleteInvestment}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="font-semibold">Controle de Investimentos</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Desenvolvido para controle pessoal de investimentos
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
