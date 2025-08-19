import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Investment, InvestmentFormData } from '@/types/investment';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InvestmentForm } from './InvestmentForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface InvestmentTableProps {
  investments: Investment[];
  onEdit: (id: string, data: InvestmentFormData) => void;
  onDelete: (id: string) => void;
}

const typeColors: Record<string, string> = {
  'Ação': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Fundo': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Título': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  'ETF': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Crypto': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
};

export const InvestmentTable = ({ investments, onEdit, onDelete }: InvestmentTableProps) => {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
  };

  const handleEditSubmit = (data: InvestmentFormData) => {
    if (editingInvestment) {
      onEdit(editingInvestment.id, data);
      setEditingInvestment(null);
    }
  };

  if (investments.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum investimento encontrado</h3>
          <p className="text-muted-foreground text-center">
            Comece cadastrando seu primeiro investimento usando o formulário acima.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Meus Investimentos ({investments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment) => (
                  <TableRow key={investment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{investment.name}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[investment.type] || 'bg-gray-100 text-gray-800'}>
                        {investment.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatCurrency(investment.amount)}
                    </TableCell>
                    <TableCell>{formatDate(investment.date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(investment)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Investimento</DialogTitle>
                            </DialogHeader>
                            {editingInvestment && (
                              <InvestmentForm
                                initialData={{
                                  name: editingInvestment.name,
                                  type: editingInvestment.type,
                                  amount: editingInvestment.amount,
                                  date: editingInvestment.date,
                                }}
                                onSubmit={handleEditSubmit}
                                submitLabel="Atualizar Investimento"
                              />
                            )}
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir Investimento</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{investment.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => onDelete(investment.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};