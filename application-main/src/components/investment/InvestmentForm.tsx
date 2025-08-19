import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { InvestmentFormData, InvestmentType } from '@/types/investment';
import { PlusCircle, DollarSign } from 'lucide-react';

interface InvestmentFormProps {
  onSubmit: (data: InvestmentFormData) => void;
  initialData?: InvestmentFormData;
  submitLabel?: string;
}

const investmentTypes: InvestmentType[] = ['Ação', 'Fundo', 'Título', 'ETF', 'Crypto'];

export const InvestmentForm = ({ onSubmit, initialData, submitLabel = "Cadastrar Investimento" }: InvestmentFormProps) => {
  const [formData, setFormData] = useState<InvestmentFormData>(
    initialData || {
      name: '',
      type: 'Ação',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
    }
  );

  const [errors, setErrors] = useState<Partial<{[K in keyof InvestmentFormData]: string}>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<{[K in keyof InvestmentFormData]: string}> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Data não pode estar no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!initialData) {
        setFormData({
          name: '',
          type: 'Ação',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card className="w-full animate-slide-up">
      <CardHeader className="gradient-primary text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          {initialData ? 'Editar Investimento' : 'Novo Investimento'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Investimento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Fundo Imobiliário XPLG11"
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Investimento</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as InvestmentType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {investmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor Investido</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                placeholder="0,00"
                className={`pl-10 ${errors.amount ? 'border-destructive' : ''}`}
              />
            </div>
            {formData.amount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(formData.amount)}
              </p>
            )}
            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data do Investimento</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          <Button type="submit" className="w-full gradient-primary text-white border-0">
            {submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};