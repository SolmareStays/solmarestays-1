import { HostawayCalendarDay } from '@/types/hostaway';

export interface PriceComponent {
  name: string;
  amount: number;
  rate?: string; // e.g., "15%" or flat
}

export interface StructuredPricingBreakdown {
  currency: string;
  nights: number;
  basePrice: number;
  fees: PriceComponent[];
  taxes: PriceComponent[];
  subtotal: number; // Base price
  totalFees: number;
  totalTaxes: number;
  grandTotal: number;
}

const round = (val: number) => Math.round(val);

export function parseHostawayResponse(
  apiResult: any,
  nights: number,
  currency: string = 'USD'
): StructuredPricingBreakdown {

  let basePrice = 0;
  let subtotal = 0;
  let totalFees = 0;
  let totalTaxes = 0;
  let grandTotal = round(apiResult.totalPrice || apiResult.finalPrice || 0);

  const fees: PriceComponent[] = [];
  const taxes: PriceComponent[] = [];

  const components = apiResult.components || [];
  const hasComponents = Array.isArray(components) && components.length > 0;

  let componentsSum = 0;

  if (hasComponents) {
    components.forEach((comp: any) => {
      // Use total if available (quantity * value), else value
      const rawAmount = comp.total ?? comp.value ?? 0;
      const amount = round(rawAmount);
      componentsSum += amount;

      const name = (comp.name || '').toLowerCase();
      const type = (comp.type || '').toLowerCase();
      const label = comp.title || comp.name || 'Fee';

      const componentObj: PriceComponent = {
        name: label,
        amount: amount,
      };

      // Categorize
      if (name === 'baserate' || name === 'rent' || type === 'accommodation') {
        basePrice += amount;
      } else if (name === 'cleaningfee') {
        // Cleaning is usually listed under fees section in UI, but it's a specific type
        fees.push(componentObj);
        totalFees += amount;
      } else if (
        name === 'occupancytax' ||
        name.includes('occupancy') ||
        name.includes('lodging') ||
        name.includes('tourism') ||
        type === 'tax'
      ) {
        taxes.push(componentObj);
        totalTaxes += amount;
      } else if (name === 'guestchannelfee' || name === 'guestservicefee' || type === 'commissions') {
        fees.push(componentObj);
        totalFees += amount;
      } else {
        // Other fees
        fees.push(componentObj);
        totalFees += amount;
      }
    });

    // Implicit Tax Logic
    // If API total matches componentsSum, good.
    // If API total > componentsSum, difference is likely hidden tax/fee.
    const diff = grandTotal - componentsSum;
    if (diff > 1) { // Tolerance
      taxes.push({ name: 'Taxes & Fees', amount: diff });
      totalTaxes += diff;
    }

  } else {
    // Fallback Logic (Flat structure)
    // Extract standard fields
    const listingPrice = round(apiResult.listingPrice ?? apiResult.basePrice ?? 0);
    basePrice = listingPrice;

    const cleaning = round(apiResult.cleaningFee ?? 0);
    if (cleaning > 0) {
      fees.push({ name: 'Cleaning fee', amount: cleaning });
      totalFees += cleaning;
    }

    // Explicit Tax field
    let explicitTax = round(apiResult.occupancyTax ?? 0);

    // Arrays in V1
    if (apiResult.taxes && Array.isArray(apiResult.taxes)) {
      apiResult.taxes.forEach((t: any) => {
        const amt = round(t.amount);
        explicitTax += amt; // Assuming occupancyTax field wasn't already summing this
        // Or parsing names
        const n = (t.name || '').toLowerCase();
        // Avoid double counting if 'occupancyTax' field captured it. 
        // Strategy: push to array, sum at end? 
        // Simplification: Push to taxes array
        taxes.push({ name: t.name || 'Tax', amount: amt });
      });
    }

    if (apiResult.fees && Array.isArray(apiResult.fees)) {
      apiResult.fees.forEach((f: any) => {
        const amt = round(f.amount);
        fees.push({ name: f.name || 'Fee', amount: amt });
        totalFees += amt;
      });
    }

    // Recalculate totals from arrays if fallback was complex. 
    // Simplified:
    if (taxes.length === 0 && explicitTax > 0) {
      taxes.push({ name: 'Occupancy tax', amount: explicitTax });
    }

    totalTaxes = taxes.reduce((sum, t) => sum + t.amount, 0);

    // Implicit diff check for fallback
    const currentSum = basePrice + totalFees + totalTaxes;
    const diff = grandTotal - currentSum;
    if (diff > 1) {
      taxes.push({ name: 'Taxes', amount: diff });
      totalTaxes += diff;
    }
  }

  // Ensure Base Price is set
  subtotal = basePrice;

  return {
    currency,
    nights,
    basePrice,
    subtotal,
    fees,
    taxes,
    totalFees,
    totalTaxes,
    grandTotal
  };
}
