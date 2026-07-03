import { DeliveryOption, ShippingFees } from '@/types';

interface FeeParams {
  weightKg: number;
  declaredValue: number;
  destinationCountry: string;
  deliveryOption: DeliveryOption;
  storageDays?: number;
  withInsurance?: boolean;
}

const BASE_RATES: Record<string, number> = {
  CM: 35,
  FR: 42,
  US: 28,
  SN: 38,
  CI: 40,
  DEFAULT: 45,
};

export function calculateFees(params: FeeParams): ShippingFees {
  const {
    weightKg,
    declaredValue,
    destinationCountry,
    deliveryOption,
    storageDays = 0,
    withInsurance = true,
  } = params;

  const baseRate = BASE_RATES[destinationCountry] ?? BASE_RATES.DEFAULT;
  const weightMultiplier = Math.max(1, Math.ceil(weightKg / 0.5));
  let transport = baseRate + (weightMultiplier - 1) * 8;

  if (deliveryOption === 'home') {
    transport += 12;
  }

  const freeStorageDays = 30;
  const storageDaysBillable = Math.max(0, storageDays - freeStorageDays);
  const storage = storageDaysBillable * 2;

  const insurance = withInsurance ? Math.max(5, declaredValue * 0.02) : 0;
  const taxes = declaredValue > 200 ? declaredValue * 0.05 : 0;

  const total = transport + storage + insurance + taxes;

  return {
    transport: Math.round(transport * 100) / 100,
    storage: Math.round(storage * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function estimateFromProductLink(_url: string, destinationCountry: string) {
  const mockPrice = 49.99;
  const mockWeight = 1.2;
  const fees = calculateFees({
    weightKg: mockWeight,
    declaredValue: mockPrice,
    destinationCountry,
    deliveryOption: 'home',
  });

  return {
    productPrice: mockPrice,
    estimatedWeight: mockWeight,
    fees,
    estimatedDays: destinationCountry === 'CM' ? '10-15' : '7-12',
    totalCost: mockPrice + fees.total,
  };
}
