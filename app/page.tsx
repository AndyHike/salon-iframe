import { redirect } from 'next/navigation';

export default function RootPage() {
  // The middleware should intercept and rewrite requests to /[domain]
  // If a request reaches here, it means the middleware didn't rewrite it
  // We can just show a generic message or redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-stone-900 mb-4">Platform Root</h1>
        <p className="text-stone-600">Please access via a tenant domain.</p>
      </div>
    </div>
  );
}
