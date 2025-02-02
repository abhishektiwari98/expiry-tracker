import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen flex flex-col items-center">
        {/* Navigation */}
        <nav className="w-full max-w-3xl bg-white shadow-md p-4 rounded-b-lg flex justify-between items-center">
          <h1 className="text-lg font-bold text-black-600">Expiry Tracker</h1>
          <div className="space-x-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">Home</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-500">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-500">Contact</Link>
          </div>
        </nav>

        <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg mt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
