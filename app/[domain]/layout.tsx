import { ReactNode } from 'react';

export default async function DomainLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ domain: string }>;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
}
