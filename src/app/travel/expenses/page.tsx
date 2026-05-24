import { getExpenses } from "./actions";
import { getVehicles } from "../trips/actions";
import VehicleExpenseClient from "./expenses-client";

export const dynamic = 'force-dynamic';

export default async function VehicleExpensePage() {
  const [expenses, vehicles] = await Promise.all([
    getExpenses(),
    getVehicles(),
  ]);

  return (
    <VehicleExpenseClient
      initialExpenses={expenses}
      initialVehicles={vehicles}
    />
  );
}
