import { getAgents } from "./actions";
import AgentsClient from "./agents-client";

export const dynamic = 'force-dynamic';

export default async function AgentManagementPage() {
  const agents = await getAgents();

  return <AgentsClient initialAgents={agents} />;
}
