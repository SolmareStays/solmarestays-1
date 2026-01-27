import { differenceInDays, addDays, isSameDay } from 'date-fns';
import { Property } from '@/data/properties';
import { HostawayCalendarDay, HostawayCoupon } from '@/types/hostaway';

export interface PricingBreakdown {
  nightlyPrices: { date: Date; price: number }[];
  subtotal: number;
  averageNightlyRate: number;
  total: number;
  breakdown: {
    label: string;
    amount: number;
  }[];
}

export function calculatePrice(
  property: Property,
  checkIn: Date,
  checkOut: Date,
  guests: number,
  calendarDays: HostawayCalendarDay[],
  coupon?: HostawayCoupon
): PricingBreakdown {
  const nights = differenceInDays(checkOut, checkIn);

  if (nights <= 0) {
    return {
      nightlyPrices: [],
      subtotal: 0,
      averageNightlyRate: property.startingPrice,
      total: 0,
      breakdown: [],
    };
  }

  // 1. Calculate Nightly Rates (Base Rent)
  const nightlyPrices: { date: Date; price: number }[] = [];
  let currentDate = new Date(checkIn);
  let subtotal = 0;

  while (currentDate < checkOut) {
    // Find price for this date in calendar
    const dayData = calendarDays.find(d => isSameDay(new Date(d.date), currentDate));

    // Fallback to property starting price if no calendar data
    // Note: Hostaway prices are usually in the calendar. 
    // If blocked, it might still have a price, or use base.
    const price = dayData?.price || property.startingPrice;

    nightlyPrices.push({
      date: new Date(currentDate),
      price: price,
    });

    subtotal += price;
    currentDate = addDays(currentDate, 1);
  }

  const averageNightlyRate = Math.round(subtotal / nights);

  // 2. Extra Person Fee
  const extraGuests = Math.max(0, guests - (property.guestsIncluded || 1));
  const extraPersonFee = extraGuests * property.priceForExtraPerson * nights;

  // 3. One-time Fees
  const cleaningFee = property.cleaningFee;
  const checkinFee = property.checkinFee;
  // Guest Channel Fee (approx 1.91% of base rent)
  const serviceFee = Math.round(subtotal * 0.0191);

  // 4. Discounts (Weekly)
  const hasWeeklyDiscount = property.weeklyDiscount && property.weeklyDiscount < 1 && nights >= 7;
  // If weekly discount exists, calculate its multiplier
  // Usually weekly discount applies to rent. 
  // IMPORTANT: Coupons usually stack or replace. 
  // Let's assume standard logic: Weekly discount applies first to Base Rent. 
  // Then Coupon applies to (Discounted Rent)? Or Coupon applies to original Base Rent?
  // Hostaway logic: "Coupons can be applied...". Often percentage is off the total rent.
  // We'll apply weekly discount first, then coupon on the RESULTING rent (or just add them up?).
  // For safety/simplicity: Apply weekly discount to base rent. Then apply coupon to the (possibly discounted) rent.

  let rentAfterWeeklyDiscount = subtotal;
  let weeklyDiscountAmount = 0;

  if (hasWeeklyDiscount) {
    const discounted = Math.round(subtotal * property.weeklyDiscount!);
    weeklyDiscountAmount = subtotal - discounted;
    rentAfterWeeklyDiscount = discounted;
  }

  // 5. Coupon Discount
  let couponDiscountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      // Percentage off the rent (after weekly discount? usually yes)
      couponDiscountAmount = Math.round(rentAfterWeeklyDiscount * (coupon.amount / 100));
    } else if (coupon.type === 'amount') {
      // Fixed amount
      couponDiscountAmount = coupon.amount;
    }
    // Ensure we don't discount more than the rent itself
    couponDiscountAmount = Math.min(couponDiscountAmount, rentAfterWeeklyDiscount);
  }

  const finalRent = rentAfterWeeklyDiscount - couponDiscountAmount;


  // 8. Generate Breakdown
  const breakdown = [
    {
      label: `$${averageNightlyRate} × ${nights} night${nights > 1 ? 's' : ''}`,
      amount: subtotal,
    },
  ];

  if (extraPersonFee > 0) {
    breakdown.push({
      label: `Extra guest fee`,
      amount: extraPersonFee,
    });
  }

  if (hasWeeklyDiscount) {
    breakdown.push({
      label: `Weekly discount`,
      amount: -weeklyDiscountAmount,
    });
  }

  if (coupon && couponDiscountAmount > 0) {
    breakdown.push({
      label: `Coupon (${coupon.name})`,
      amount: -couponDiscountAmount,
    });
  }

  if (cleaningFee > 0) {
    breakdown.push({
      label: `Cleaning Fee`,
      amount: cleaningFee,
    });
  }

  if (serviceFee > 0) {
    breakdown.push({
      label: `Guest Channel Fee`,
      amount: serviceFee,
    });
  }

  if (checkinFee > 0) {
    breakdown.push({
      label: `Check-in fee`,
      amount: checkinFee,
    });
  }

  // 6. Refundable Deposit
  const damageDeposit = property.refundableDamageDeposit;

  // 7. Total Calculation
  // Total = FinalRent + Fees + Deposit
  if (damageDeposit > 0) {
    breakdown.push({
      label: `Refundable Damage Deposit`,
      amount: damageDeposit,
    });
  }

  // 7. Taxes (Occupancy Tax)
  // Use property.propertyRentTax if available (e.g. 15 for 15% ?)
  // Hostaway usually exports tax as percentage.
  const taxRate = property.propertyRentTax ? property.propertyRentTax / 100 : 0;
  let occupancyTax = 0;
  if (taxRate > 0) {
    // Tax usually applies to (Rent + Cleaning + ExtraPersonFee). Check specific rules.
    const taxableAmount = finalRent + cleaningFee + extraPersonFee;
    occupancyTax = Math.round(taxableAmount * taxRate);
  }

  if (occupancyTax > 0) {
    breakdown.push({
      label: `Occupancy tax`,
      amount: occupancyTax,
    });
  }

  // Update Total
  const total = finalRent + extraPersonFee + cleaningFee + checkinFee + serviceFee + damageDeposit + occupancyTax;

  return {
    nightlyPrices,
    subtotal: subtotal,
    averageNightlyRate,
    total,
    breakdown,
  };
}
