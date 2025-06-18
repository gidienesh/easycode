import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Service",
  description: "EasyCode Finance Service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
