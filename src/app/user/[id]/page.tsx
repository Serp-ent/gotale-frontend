import ClientPage from "./client-page";

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:8000/api/users/');
    const users = await response.json();
    return users.map((user: { id: string }) => ({
      id: user.id,
    }));
  } catch (error) {
    console.error("Failed to fetch users for static generation:", error);
    return [];
  }
}

export default function Page() {
  return <ClientPage />;
}