import ClientPage from "./client-page";

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:8000/api/users/');
    if (!response.ok) {
       throw new Error(`Fetch failed with status: ${response.status}`);
    }
    const users = await response.json();
    
    if (!users || users.length === 0) {
        return [{ id: 'static-build-placeholder' }];
    }

    return users.map((user: { id: string }) => ({
      id: user.id,
    }));
  } catch (error) {
    console.warn("Could not fetch users for static generation - using placeholder.");
    return [{ id: 'static-build-placeholder' }];
  }
}

export default function Page() {
  return <ClientPage />;
}