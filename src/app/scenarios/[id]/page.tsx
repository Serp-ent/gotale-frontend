import ClientPage from "./client-page";

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:8000/api/scenarios/');
    const scenarios = await response.json();
    return scenarios.map((scenario: { id: string }) => ({
      id: scenario.id,
    }));
  } catch (error) {
    console.error("Failed to fetch scenarios for static generation:", error);
    return [];
  }
}

export default function Page() {
  return <ClientPage />;
}