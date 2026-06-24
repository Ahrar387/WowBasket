import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site py-24 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 text-lg">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/" className="btn-primary text-base px-6 py-3">Go Home</Link>
        <Link href="/products" className="btn-secondary text-base px-6 py-3">Browse Products</Link>
      </div>
    </div>
  );
}
