import { useState, useEffect } from 'react';
import { Investment, InvestmentFormData, InvestmentSummary } from '@/types/investment';
import { toast } from '@/hooks/use-toast';

// Mock data for development
const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Fundo Imobiliário XPLG11',
    type: 'Fundo',
    amount: 5000,
    date: '2024-01-15',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Ação Petrobras PETR4',
    type: 'Ação',
    amount: 3000,
    date: '2024-02-10',
    createdAt: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Tesouro Direto IPCA+',
    type: 'Título',
    amount: 10000,
    date: '2024-01-20',
    createdAt: '2024-01-20T09:15:00Z',
  },
];

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const stored = localStorage.getItem('investments');
      if (stored) {
        setInvestments(JSON.parse(stored));
      } else {
        setInvestments(mockInvestments);
        localStorage.setItem('investments', JSON.stringify(mockInvestments));
      }
      setLoading(false);
    }, 500);
  }, []);

  const saveToStorage = (data: Investment[]) => {
    localStorage.setItem('investments', JSON.stringify(data));
  };

  const createInvestment = (data: InvestmentFormData) => {
    const newInvestment: Investment = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...investments, newInvestment];
    setInvestments(updated);
    saveToStorage(updated);
    
    toast({
      title: "Investimento cadastrado!",
      description: `${data.name} foi adicionado com sucesso.`,
      variant: "default",
    });

    return newInvestment;
  };

  const updateInvestment = (id: string, data: InvestmentFormData) => {
    const updated = investments.map(inv => 
      inv.id === id 
        ? { ...inv, ...data, updatedAt: new Date().toISOString() }
        : inv
    );
    
    setInvestments(updated);
    saveToStorage(updated);
    
    toast({
      title: "Investimento atualizado!",
      description: `${data.name} foi atualizado com sucesso.`,
      variant: "default",
    });
  };

  const deleteInvestment = (id: string) => {
    const investment = investments.find(inv => inv.id === id);
    const updated = investments.filter(inv => inv.id !== id);
    
    setInvestments(updated);
    saveToStorage(updated);
    
    toast({
      title: "Investimento excluído!",
      description: `${investment?.name} foi removido.`,
      variant: "destructive",
    });
  };

  const getSummary = (): InvestmentSummary => {
    const totalAmount = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalInvestments = investments.length;
    
    const distributionByType = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + inv.amount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      totalAmount,
      totalInvestments,
      distributionByType,
    };
  };

  return {
    investments,
    loading,
    createInvestment,
    updateInvestment,
    deleteInvestment,
    getSummary,
  };
};