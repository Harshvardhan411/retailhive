import Link from 'next/link';
import Image from 'next/image';

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Image src="/Background1.png" alt="background" fill className="absolute inset-0 w-full h-full object-cover -z-10" />
      {/* Decorative background removed to let the image show */}
      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center bg-white/80 rounded-3xl shadow-2xl backdrop-blur-md">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 drop-shadow-lg">RetailHive</h1>
        <p className="text-lg text-gray-900 mb-8 max-w-xl mx-auto">
          Welcome to RetailHive: Empowering rural merchants to advertise and sell their products globally. Securely update product information and reach new customers, all from your mobile device.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <Link href="/admin/login" className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-8 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform">Admin Portal</Link>
          <Link href="/user/login" className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-8 rounded-xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform">User Portal</Link>
        </div>
        <div className="mt-10 text-sm text-gray-700">RetailHive &mdash; Connecting rural towns to the world, one shop at a time.</div>
      </div>
    </main>
  );
}
