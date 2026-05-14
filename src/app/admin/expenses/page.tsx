import { getExpenses, getVehicles } from "./actions";
import ExpensesClient from "./expenses-client";

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const [expenses, vehicles] = await Promise.all([
    getExpenses(),
    getVehicles()
  ]);
  
  return <ExpensesClient initialExpenses={expenses} initialVehicles={vehicles} />;
}
