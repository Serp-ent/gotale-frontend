import ClientPage from "./client-page";

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:8000/api/scenarios/');
    if (!response.ok) {
       // If backend is down or 404, throw to catch block
       throw new Error(`Fetch failed with status: ${response.status}`);
    }
    const scenarios = await response.json();
    
    // If no scenarios, return placeholder to avoid "missing generateStaticParams" build error
    if (!scenarios || scenarios.length === 0) {
        return [{ id: 'static-build-placeholder' }];
    }

    return scenarios.map((scenario: { id: string }) => ({
      id: scenario.id,
    }));
  } catch (error) {
    console.warn("Could not fetch scenarios for static generation - using placeholder.");
    return [{ id: 'static-build-placeholder' }];
  }
}

export default function Page() {
  return <ClientPage />;
}