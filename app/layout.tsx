import "./globals.css";

export const metadata = {
  title: "TechStack",
  description: "TechStack Guide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
