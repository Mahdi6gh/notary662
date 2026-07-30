import {
  RealEstateInput,
  RealEstateResult,
  FinancialInput,
  FinancialResult,
  RentInput,
  RentResult,
  HeirSelection,
  InheritanceResult,
  HeirShareDetail,
} from '../types';

/**
 * Generic Tiered Calculation Helper
 * Calculates total tiered amount based on value brackets
 */
export function calculateTiered(
  val: number,
  baseFee: number,
  tiers: Array<{ minLimit: number; maxLimit: number; rate: number }>
): number {
  if (val <= 0) return 0;
  let total = baseFee;

  for (const tier of tiers) {
    if (val > tier.minLimit) {
      const taxable = Math.min(val, tier.maxLimit) - tier.minLimit;
      total += taxable * tier.rate;
    }
  }

  return Math.round(total);
}

/**
 * 1. Real Estate & Pre-Sale Documents (اسناد غیرمنقول و پیش‌فروش ساختمان)
 */
export function calculateRealEstate(input: RealEstateInput): RealEstateResult {
  const propertyPriceRial = Math.max(0, input.propertyPrice);
  const sellersCount = Math.max(1, input.sellersCount);
  const buyersCount = Math.max(1, input.buyersCount);
  const extraPages = Math.max(0, input.extraPages);

  // Tiered Haq-ol-Tahrir
  const realEstateTiers = [
    { minLimit: 2_000_000, maxLimit: 10_000_000, rate: 1.188 },
    { minLimit: 10_000_000, maxLimit: 50_000_000, rate: 0.756 },
    { minLimit: 50_000_000, maxLimit: 100_000_000, rate: 0.243 },
    { minLimit: 100_000_000, maxLimit: 200_000_000, rate: 0.108 },
    { minLimit: 200_000_000, maxLimit: 500_000_000, rate: 0.0675 },
    { minLimit: 500_000_000, maxLimit: 1_000_000_000, rate: 0.03375 },
    { minLimit: 1_000_000_000, maxLimit: Infinity, rate: 0.0135 },
  ];

  const baseTahrir = 4_725_000;
  const haqOlTahrirRial = propertyPriceRial > 0 
    ? calculateTiered(propertyPriceRial, baseTahrir, realEstateTiers)
    : 0;

  // Special Calculation Base = 9% of Property Price
  const specialBaseRial = propertyPriceRial * 0.09;

  // Derived from 9% Special Base
  const haqOlSabtRial = Math.round(specialBaseRial * 0.005); // 0.5% of 9% base
  const cadastreRial = Math.round(specialBaseRial * 0.005); // 0.5% of 9% base
  const vatRial = Math.round(specialBaseRial * 0.10); // 10% of 9% base

  // Fixed Electronic Registration Fee
  const electronicRegRial = 300_000;

  // Extra sellers & buyers fee (109,000 Rials per extra person over 1 for sellers and buyers)
  const extraSellers = Math.max(0, sellersCount - 1);
  const extraBuyers = Math.max(0, buyersCount - 1);
  const extraPersonsRial = (extraSellers + extraBuyers) * 109_000;

  // Extra pages
  const extraPagesRial = extraPages * 200_000;

  // Inquiries
  let inquiriesRial = 0;
  if (input.inquiryRegistration) inquiriesRial += 1_260_000;
  if (input.inquiryTax) inquiriesRial += 1_500_000;
  if (input.inquiryMunicipality) inquiriesRial += 600_000;

  const totalRial =
    haqOlTahrirRial +
    haqOlSabtRial +
    cadastreRial +
    vatRial +
    electronicRegRial +
    extraPersonsRial +
    extraPagesRial +
    inquiriesRial;

  return {
    propertyPriceRial,
    specialBaseRial,
    haqOlTahrirRial,
    haqOlSabtRial,
    cadastreRial,
    vatRial,
    inquiriesRial,
    extraPersonsRial,
    extraPagesRial,
    electronicRegRial,
    totalRial,
  };
}

/**
 * 2. Financial & Mortgage Documents (سایر اسناد مالی و رهنی)
 */
export function calculateFinancial(input: FinancialInput): FinancialResult {
  const documentAmountRial = Math.max(0, input.documentAmount);
  const totalParties = Math.max(2, input.totalParties);
  const extraPages = Math.max(0, input.extraPages);

  const financialTiers = [
    { minLimit: 10_000_000, maxLimit: 100_000_000, rate: 0.0429 },
    { minLimit: 100_000_000, maxLimit: 200_000_000, rate: 0.0325 },
    { minLimit: 200_000_000, maxLimit: 500_000_000, rate: 0.01965 },
    { minLimit: 500_000_000, maxLimit: 1_000_000_000, rate: 0.01441 },
    { minLimit: 1_000_000_000, maxLimit: 3_000_000_000, rate: 0.0078 },
    { minLimit: 3_000_000_000, maxLimit: 6_000_000_000, rate: 0.00381 },
    { minLimit: 6_000_000_000, maxLimit: 10_000_000_000, rate: 0.00264 },
    { minLimit: 10_000_000_000, maxLimit: 20_000_000_000, rate: 0.00198 },
    { minLimit: 20_000_000_000, maxLimit: 100_000_000_000, rate: 0.00075 },
    { minLimit: 100_000_000_000, maxLimit: Infinity, rate: 0.00012 },
  ];

  const baseTahrirThreshold = 2_875_000;
  const baseHaqOlTahrirRial = documentAmountRial > 0
    ? calculateTiered(documentAmountRial, baseTahrirThreshold, financialTiers)
    : 0;

  // Extra parties > 2 = 200,000 Rials each
  const extraPartiesCount = Math.max(0, totalParties - 2);
  const extraPartiesHaqOlTahrirRial = extraPartiesCount * 200_000;

  // Extra pages = 200,000 Rials each
  const extraPagesHaqOlTahrirRial = extraPages * 200_000;

  // Total Haq-ol-Tahrir
  const totalHaqOlTahrirRial =
    baseHaqOlTahrirRial + extraPartiesHaqOlTahrirRial + extraPagesHaqOlTahrirRial;

  // Haq-ol-Sabt (1% of Document Amount)
  const haqOlSabtRial = Math.round(documentAmountRial * 0.01);

  // VAT (10% of total Haq-ol-Tahrir)
  const vatRial = Math.round(totalHaqOlTahrirRial * 0.10);

  // Electronic Reg
  const electronicRegRial = 300_000;

  const totalRial =
    haqOlSabtRial + totalHaqOlTahrirRial + vatRial + electronicRegRial;

  return {
    documentAmountRial,
    baseHaqOlTahrirRial,
    extraPartiesHaqOlTahrirRial,
    extraPagesHaqOlTahrirRial,
    totalHaqOlTahrirRial,
    haqOlSabtRial,
    vatRial,
    electronicRegRial,
    totalRial,
  };
}

/**
 * 3. Rent / Lease Documents (اسناد اجاره)
 */
export function calculateRent(input: RentInput): RentResult {
  const depositAmountRial = Math.max(0, input.depositAmount);
  const monthlyRentRial = Math.max(0, input.monthlyRent);
  const durationMonths = Math.max(1, input.durationMonths);
  const lessorsCount = Math.max(1, input.lessorsCount);
  const lesseesCount = Math.max(1, input.lesseesCount);
  const extraPages = Math.max(0, input.extraPages);

  // Calculation Base = Deposit + (Monthly Rent * Duration)
  const calculationBaseRial = depositAmountRial + monthlyRentRial * durationMonths;

  const rentTiers = [
    { minLimit: 2_000_000, maxLimit: 10_000_000, rate: 0.399 },
    { minLimit: 10_000_000, maxLimit: 50_000_000, rate: 0.262 },
    { minLimit: 50_000_000, maxLimit: 100_000_000, rate: 0.065 },
    { minLimit: 100_000_000, maxLimit: 200_000_000, rate: 0.0369 },
    { minLimit: 200_000_000, maxLimit: 500_000_000, rate: 0.018 },
    { minLimit: 500_000_000, maxLimit: 1_000_000_000, rate: 0.012 },
    { minLimit: 1_000_000_000, maxLimit: 3_000_000_000, rate: 0.01003 },
    { minLimit: 3_000_000_000, maxLimit: Infinity, rate: 0.00585 },
  ];

  const baseTahrirThreshold = 2_627_000;
  const haqOlTahrirRial = calculationBaseRial > 0
    ? calculateTiered(calculationBaseRial, baseTahrirThreshold, rentTiers)
    : 0;

  // Haq-ol-Sabt (0.5% of calculation base)
  const haqOlSabtRial = Math.round(calculationBaseRial * 0.005);

  // Cadastre (0.5% of calculation base)
  const cadastreRial = Math.round(calculationBaseRial * 0.005);

  // VAT (10% of Haq-ol-Tahrir)
  const vatRial = Math.round(haqOlTahrirRial * 0.10);

  // Electronic Reg
  const electronicRegRial = 300_000;

  // Extra lessors / lessees fee (109,000 Rials each over 1)
  const extraLessors = Math.max(0, lessorsCount - 1);
  const extraLessees = Math.max(0, lesseesCount - 1);
  const extraPersonsRial = (extraLessors + extraLessees) * 109_000;

  // Extra pages
  const extraPagesRial = extraPages * 200_000;

  // Inquiries
  let inquiriesRial = 0;
  if (input.inquiryRegistration) inquiriesRial += 563_500;
  if (input.inquiryTax) inquiriesRial += 163_500;
  if (input.inquiryMunicipality) inquiriesRial += 163_500;

  const totalRial =
    haqOlTahrirRial +
    haqOlSabtRial +
    cadastreRial +
    vatRial +
    electronicRegRial +
    extraPersonsRial +
    extraPagesRial +
    inquiriesRial;

  return {
    depositAmountRial,
    monthlyRentRial,
    durationMonths,
    calculationBaseRial,
    haqOlTahrirRial,
    haqOlSabtRial,
    cadastreRial,
    vatRial,
    inquiriesRial,
    extraPersonsRial,
    extraPagesRial,
    electronicRegRial,
    totalRial,
  };
}

/**
 * 4. Inheritance Share Calculator (محاسبه سهم‌الارث)
 */
export function calculateInheritance(
  estateValueRial: number,
  heir: HeirSelection
): InheritanceResult {
  const heirs: HeirShareDetail[] = [];
  const val = Math.max(0, estateValueRial);

  const sons = Math.max(0, heir.sonsCount);
  const daughters = Math.max(0, heir.daughtersCount);
  const hasChildren = sons > 0 || daughters > 0;

  let spouseFraction = 0;
  let husbandFraction = 0;
  let wivesTotalFraction = 0;

  // 1. Spouse Share
  if (heir.hasHusband) {
    husbandFraction = hasChildren ? 1 / 4 : 1 / 2;
    spouseFraction += husbandFraction;
    heirs.push({
      id: 'husband',
      title: 'زوج (شوهر)',
      count: 1,
      fractionText: hasChildren ? '۱/۴ (یک چهارم)' : '۱/۲ (یک دوم)',
      shareDecimal: husbandFraction,
      movableAmountRial: Math.round(val * husbandFraction),
      immovableAmountRial: Math.round(val * husbandFraction),
      note: hasChildren ? 'به دلیل وجود فرزند' : 'بدون وجود فرزند',
    });
  } else if (heir.wivesCount > 0) {
    const totalWivesCount = Math.min(4, Math.max(1, heir.wivesCount));
    wivesTotalFraction = hasChildren ? 1 / 8 : 1 / 4;
    spouseFraction += wivesTotalFraction;

    const eachWifeFraction = wivesTotalFraction / totalWivesCount;

    heirs.push({
      id: 'wives',
      title: totalWivesCount > 1 ? `زوجه‌ها (${totalWivesCount} همسر)` : 'زوجه (همسر دائم)',
      count: totalWivesCount,
      fractionText: hasChildren
        ? totalWivesCount > 1
          ? `۱/۸ کل (بین ${totalWivesCount} نفر مساوی)`
          : '۱/۸ (یک هشتم)'
        : totalWivesCount > 1
        ? `۱/۴ کل (بین ${totalWivesCount} نفر مساوی)`
        : '۱/۴ (یک چهارم)',
      shareDecimal: wivesTotalFraction,
      movableAmountRial: Math.round(val * wivesTotalFraction),
      immovableAmountRial: Math.round(val * wivesTotalFraction),
      isWifeSpecial: true,
      note: '⚠️ زوجه از عین اموال غیرمنقول ارث نمی‌برد، بلکه بهای آن را طلبکار است.',
    });
  }

  // 2. Parents Share
  let fatherFraction = 0;
  let motherFraction = 0;

  if (heir.hasFather) {
    if (hasChildren) {
      fatherFraction = 1 / 6;
    } else {
      // If no children, father gets residue later
      fatherFraction = 0;
    }
  }

  if (heir.hasMother) {
    motherFraction = hasChildren ? 1 / 6 : 1 / 3;
    heirs.push({
      id: 'mother',
      title: 'مادر',
      count: 1,
      fractionText: hasChildren ? '۱/۶ (یک ششم)' : '۱/۳ (یک سوم)',
      shareDecimal: motherFraction,
      movableAmountRial: Math.round(val * motherFraction),
      immovableAmountRial: Math.round(val * motherFraction),
      note: hasChildren ? 'به دلیل وجود فرزند' : 'بدون وجود فرزند',
    });
  }

  // Fixed shares so far
  const fixedShareSum = spouseFraction + (heir.hasFather && hasChildren ? fatherFraction : 0) + motherFraction;
  let residue = Math.max(0, 1 - fixedShareSum);

  // 3. Children Share
  if (hasChildren) {
    if (heir.hasFather) {
      heirs.push({
        id: 'father',
        title: 'پدر',
        count: 1,
        fractionText: '۱/۶ (یک ششم)',
        shareDecimal: 1 / 6,
        movableAmountRial: Math.round(val * (1 / 6)),
        immovableAmountRial: Math.round(val * (1 / 6)),
        note: 'سهم فرض پدر در حضور فرزند',
      });
    }

    if (sons > 0) {
      // Ratio: Each son 2 parts, each daughter 1 part
      const totalParts = 2 * sons + daughters;
      const eachSonPartFraction = (2 / totalParts) * residue;
      const totalSonsFraction = (2 * sons / totalParts) * residue;

      heirs.push({
        id: 'sons',
        title: sons > 1 ? `پسران (${sons} نفر)` : 'پسر',
        count: sons,
        fractionText: sons > 1 ? `هر کدام ${formatFractionText(eachSonPartFraction)} (نسبت ۲ به ۱)` : formatFractionText(totalSonsFraction),
        shareDecimal: totalSonsFraction,
        movableAmountRial: Math.round(val * totalSonsFraction),
        immovableAmountRial: Math.round(val * totalSonsFraction),
        note: 'دو برابر سهم دختر از باقیمانده ترکه',
      });

      if (daughters > 0) {
        const eachDaughterPartFraction = (1 / totalParts) * residue;
        const totalDaughtersFraction = (daughters / totalParts) * residue;

        heirs.push({
          id: 'daughters',
          title: daughters > 1 ? `دختران (${daughters} نفر)` : 'دختر',
          count: daughters,
          fractionText: daughters > 1 ? `هر کدام ${formatFractionText(eachDaughterPartFraction)}` : formatFractionText(totalDaughtersFraction),
          shareDecimal: totalDaughtersFraction,
          movableAmountRial: Math.round(val * totalDaughtersFraction),
          immovableAmountRial: Math.round(val * totalDaughtersFraction),
          note: 'نصف سهم پسر از باقیمانده ترکه',
        });
      }
    } else {
      // ONLY daughters (No sons)
      let totalDaughtersFraction = daughters === 1 ? 1 / 2 : 2 / 3;
      // If fixed shares exceed remaining, scale or assign
      if (totalDaughtersFraction > residue) {
        totalDaughtersFraction = residue;
      }

      const eachDaughterFraction = totalDaughtersFraction / daughters;

      heirs.push({
        id: 'daughters',
        title: daughters > 1 ? `دختران (${daughters} نفر)` : 'دختر',
        count: daughters,
        fractionText: daughters === 1 ? '۱/۲ (یک دوم)' : `۲/۳ کل (${formatFractionText(eachDaughterFraction)} برای هر نفر)`,
        shareDecimal: totalDaughtersFraction,
        movableAmountRial: Math.round(val * totalDaughtersFraction),
        immovableAmountRial: Math.round(val * totalDaughtersFraction),
        note: daughters === 1 ? 'سهم فرض تک‌دختر' : 'سهم فرض دو یا چند دختر',
      });
    }
  } else {
    // NO children
    if (heir.hasFather) {
      // Father gets remaining residue after spouse & mother
      const fatherResidueFraction = Math.max(0, 1 - spouseFraction - motherFraction);
      heirs.push({
        id: 'father',
        title: 'پدر',
        count: 1,
        fractionText: formatFractionText(fatherResidueFraction),
        shareDecimal: fatherResidueFraction,
        movableAmountRial: Math.round(val * fatherResidueFraction),
        immovableAmountRial: Math.round(val * fatherResidueFraction),
        note: 'بردن تمام باقیمانده ترکه به عنوان قرابت',
      });
    }
  }

  // Total fraction sum
  const totalFractionDecimal = heirs.reduce((acc, h) => acc + h.shareDecimal, 0);

  return {
    estateValueRial: val,
    heirs,
    totalFractionDecimal,
    hasWifeWarning: heir.wivesCount > 0,
  };
}

/**
 * Format decimal to friendly fraction string format (e.g. 1/8, 1/6, 1/3, 7/24)
 */
function formatFractionText(decimal: number): string {
  if (decimal <= 0) return '۰٪';
  // Common denominators check (2, 3, 4, 6, 8, 12, 24, 48)
  const denoms = [2, 3, 4, 6, 8, 12, 16, 24, 48];
  for (const d of denoms) {
    const num = Math.round(decimal * d);
    if (Math.abs(decimal - num / d) < 0.005) {
      if (num === d) return 'تمام ترکه (۱)';
      return `${num}/${d}`;
    }
  }
  return `${(decimal * 100).toFixed(1)}٪`;
}
