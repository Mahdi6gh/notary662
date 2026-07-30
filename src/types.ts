export type CurrencyUnit = 'RIAL' | 'TOMAN';

export type CalculatorTab = 'real_estate' | 'financial' | 'rent' | 'inheritance';

export interface RealEstateInput {
  propertyPrice: number; // in current currency
  sellersCount: number;
  buyersCount: number;
  extraPages: number;
  inquiryRegistration: boolean; // 1,260,000 Rials
  inquiryTax: boolean; // 1,500,000 Rials
  inquiryMunicipality: boolean; // 600,000 Rials
}

export interface RealEstateResult {
  propertyPriceRial: number;
  specialBaseRial: number; // 9% of property price
  haqOlTahrirRial: number;
  haqOlSabtRial: number; // 0.5% of special base
  cadastreRial: number; // 0.5% of special base
  vatRial: number; // 10% of special base
  inquiriesRial: number;
  extraPersonsRial: number; // 109,000 Rials per person over 1
  extraPagesRial: number;
  electronicRegRial: number; // 300,000 Rials
  totalRial: number;
}

export interface FinancialInput {
  documentAmount: number; // Principal + Interest
  totalParties: number; // Default 2 (Mortgagor, Loan Recipient, Bank/Mortgagee)
  extraPages: number;
}

export interface FinancialResult {
  documentAmountRial: number;
  baseHaqOlTahrirRial: number;
  extraPartiesHaqOlTahrirRial: number; // 200,000 Rials per extra person over 2
  extraPagesHaqOlTahrirRial: number; // 200,000 Rials per extra page
  totalHaqOlTahrirRial: number;
  haqOlSabtRial: number; // 1% of document amount
  vatRial: number; // 10% of total Haq-ol-Tahrir
  electronicRegRial: number; // 300,000 Rials
  totalRial: number;
}

export interface RentInput {
  depositAmount: number; // رهن / ودیعه
  monthlyRent: number; // اجاره ماهانه
  durationMonths: number; // مدت به ماه
  lessorsCount: number; // موجر
  lesseesCount: number; // مستأجر
  extraPages: number;
  inquiryRegistration: boolean; // 563,500 Rials
  inquiryTax: boolean; // 163,500 Rials
  inquiryMunicipality: boolean; // 163,500 Rials
}

export interface RentResult {
  depositAmountRial: number;
  monthlyRentRial: number;
  durationMonths: number;
  calculationBaseRial: number; // Deposit + (Rent * Duration)
  haqOlTahrirRial: number;
  haqOlSabtRial: number; // 0.5% of base
  cadastreRial: number; // 0.5% of base
  vatRial: number; // 10% of Haq-ol-Tahrir
  inquiriesRial: number;
  extraPersonsRial: number; // 109,000 Rials per extra over 1
  extraPagesRial: number;
  electronicRegRial: number; // 300,000 Rials
  totalRial: number;
}

export interface HeirSelection {
  sonsCount: number;
  daughtersCount: number;
  hasHusband: boolean;
  wivesCount: number;
  hasFather: boolean;
  hasMother: boolean;
  isNewLaw: boolean; // true = 1389+, false = old law
}

export interface HeirShareDetail {
  id: string;
  title: string;
  count: number;
  fractionText: string;
  shareDecimal: number;
  movableAmountRial: number;
  immovableAmountRial: number;
  isWifeSpecial?: boolean; // Highlight wife claim on immovable price
  note?: string;
}

export interface InheritanceResult {
  estateValueRial: number;
  heirs: HeirShareDetail[];
  totalFractionDecimal: number;
  hasWifeWarning: boolean;
}

export interface SavedCalculation {
  id: string;
  dateStr: string;
  timestamp: number;
  tab: CalculatorTab;
  title: string;
  description: string;
  totalRial: number;
  inputs: Record<string, unknown>;
}
