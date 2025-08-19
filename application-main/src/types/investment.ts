export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export type InvestmentType = 'Ação' | 'Fundo' | 'Título' | 'ETF' | 'Crypto';

export interface InvestmentFormData {
  name: string;
  type: InvestmentType;
  amount: number;
  date: string;
}

export interface InvestmentSummary {
  totalAmount: number;
  totalInvestments: number;
  distributionByType: { [key in InvestmentType]?: number };
}