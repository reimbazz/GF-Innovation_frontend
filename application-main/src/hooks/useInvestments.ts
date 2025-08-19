
import { useState, useEffect } from 'react';
import { Investment, InvestmentFormData, InvestmentSummary } from '@/types/investment';
import { toast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:3001/api/investments';

export const useInvestments = () => {

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all investments from backend
  const fetchInvestments = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setInvestments(data);
    } catch (e) {
      toast({ title: 'Erro ao carregar investimentos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
    // eslint-disable-next-line
  }, []);

  const createInvestment = async (data: InvestmentFormData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          value: data.amount,
          date: data.date,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.join(', ') || 'Erro ao cadastrar');
      }
      const newInvestment = await res.json();
      setInvestments((prev) => [...prev, {
        ...newInvestment,
        amount: newInvestment.value, // compatibilidade
      }]);
      toast({
        title: 'Investimento cadastrado!',
        description: `${data.name} foi adicionado com sucesso.`,
        variant: 'default',
      });
      return newInvestment;
    } catch (e: any) {
      toast({ title: e.message, variant: 'destructive' });
    }
  };

  const updateInvestment = async (id: string, data: InvestmentFormData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          value: data.amount,
          date: data.date,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.join(', ') || 'Erro ao atualizar');
      }
      const updated = await res.json();
      setInvestments((prev) => prev.map((inv) =>
        inv.id === id ? { ...inv, ...updated, amount: updated.value } : inv
      ));
      toast({
        title: 'Investimento atualizado!',
        description: `${data.name} foi atualizado com sucesso.`,
        variant: 'default',
      });
    } catch (e: any) {
      toast({ title: e.message, variant: 'destructive' });
    }
  };

  const deleteInvestment = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao excluir');
      }
      setInvestments((prev) => prev.filter((inv) => inv.id !== id));
      toast({
        title: 'Investimento excluído!',
        description: `Investimento removido com sucesso.`,
        variant: 'destructive',
      });
    } catch (e: any) {
      toast({ title: e.message, variant: 'destructive' });
    }
  };

  const getSummary = (): InvestmentSummary => {
    const totalAmount = investments.reduce((sum, inv) => sum + (inv.amount ?? inv.value ?? 0), 0);
    const totalInvestments = investments.length;
    const distributionByType = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + (inv.amount ?? inv.value ?? 0);
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