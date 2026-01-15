import ClientPage from "./client-page";

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return <ClientPage />;
}