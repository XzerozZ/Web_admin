import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Page - Kasian Phrom",
  description: "Admin Page - Kasian Phrom",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <header>Admin Header</header>
      <main>{children}</main>
    </div>
  );
}
