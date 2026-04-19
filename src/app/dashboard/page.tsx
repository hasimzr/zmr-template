import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Hesabım | Zmr Elektronik",
  description: "Zmr Elektronik kullanıcı hesabı üzerinden siparişlerinizi, adreslerinizi ve profil bilgilerinizi yönetebilirsiniz.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Dashboard = async ({ searchParams }: PageProps) => {
  const resolvedParams = await searchParams;
  const activeTab = (resolvedParams?.tab as string) || "orders";

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Hesabım
        </h1>
        <DashboardClient initialTab={activeTab} />
      </div>
    </div>
  );
};

export default Dashboard;
