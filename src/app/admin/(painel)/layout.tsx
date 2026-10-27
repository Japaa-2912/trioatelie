import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAdminSettings } from "@/lib/data/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Painel",
    template: "%s | Painel",
  },
  robots: { index: false, follow: false },
};

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();
  const settings = await getAdminSettings();

  return (
    <div className="min-h-dvh bg-cream lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
      <AdminNav
        brandName={settings.brandName}
        logoUrl={settings.logoUrl}
        userName={profile.fullName || "Proprietária"}
        userEmail={profile.email}
      />
      <div className="min-w-0">
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
