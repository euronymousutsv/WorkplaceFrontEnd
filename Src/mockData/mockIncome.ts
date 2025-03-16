import { mockShifts } from "./mockShifts";

const HOURLY_RATE = 30; // Example hourly rate

// Function to get the first Wednesday of a given month
const getFirstWednesday = (year: number, month: number): Date => {
  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();
  let firstWednesday = new Date(firstDay);

  if (dayOfWeek <= 3) {
    firstWednesday.setDate(firstDay.getDate() + (3 - dayOfWeek)); // Move forward to Wednesday
  } else {
    firstWednesday.setDate(firstDay.getDate() + (10 - dayOfWeek)); // Move to next week's Wednesday
  }

  return firstWednesday;
};

// Function to generate 2-week pay periods for a given year and month
const generatePayPeriods = (
  year: number,
  month: number
): { start: Date; end: Date }[] => {
  const payPeriods = [];
  let periodStart = getFirstWednesday(year, month);

  while (periodStart.getMonth() === month) {
    let periodEnd = new Date(periodStart);
    periodEnd.setDate(periodStart.getDate() + 13); // Add 13 days for 2 weeks

    payPeriods.push({ start: new Date(periodStart), end: new Date(periodEnd) });

    // Move to next pay period (2 weeks later)
    periodStart.setDate(periodStart.getDate() + 14);
  }

  return payPeriods;
};

// Group shifts into pay periods
const groupShiftsByPayPeriod = (shifts: any[]) => {
  if (shifts.length === 0) return [];

  shifts.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()); // Sort shifts by date

  const incomeGroups: { [key: string]: any } = {};

  shifts.forEach((shift) => {
    const shiftDate = new Date(shift.startTime);
    const payPeriods = generatePayPeriods(
      shiftDate.getFullYear(),
      shiftDate.getMonth()
    );

    // Find the pay period that contains the shift
    for (const period of payPeriods) {
      if (shiftDate >= period.start && shiftDate <= period.end) {
        const periodKey = `${period.start.toDateString()} - ${period.end.toDateString()}`;

        if (!incomeGroups[periodKey]) {
          incomeGroups[periodKey] = {
            period: periodKey,
            shifts: [],
            totalHours: 0,
            totalEarnings: 0,
          };
        }

        // Calculate earnings for this shift
        const hoursWorked =
          (shift.endTime.getTime() - shift.startTime.getTime()) /
          (1000 * 60 * 60);
        const earnings = hoursWorked * HOURLY_RATE;

        // Add shift to this pay period
        incomeGroups[periodKey].shifts.push({
          id: shift.id,
          date: shift.startTime.toDateString(),
          hoursWorked: hoursWorked.toFixed(2),
          earnings,
        });

        // Update totals
        incomeGroups[periodKey].totalHours += hoursWorked;
        incomeGroups[periodKey].totalEarnings += earnings;

        break; // Stop once the shift is assigned to a pay period
      }
    }
  });

  return Object.values(incomeGroups); // Convert object to array
};

// Generate grouped income
export const mockIncome = groupShiftsByPayPeriod(mockShifts);
