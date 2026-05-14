import { getExpenses, getVehicles } from "./actions";
import ExpensesClient from "./expenses-client";

export default async function ExpensesPage() {
  const [expenses, vehicles] = await Promise.all([
    getExpenses(),
    getVehicles()
  ]);
  
  return <ExpensesClient initialExpenses={expenses} initialVehicles={vehicles} />;
}
