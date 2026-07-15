import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function OrderConfirmation() {
  const router = useRouter();
  const { orderId } = router.query;

  return (
    <>
      <Head>
        <title>Order confirmed - Ibrahim's Market</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full border border-gray-200 text-center">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order placed!</h1>
          <p className="text-gray-600 mb-4">
            Thanks for your order. Each shop will confirm your items shortly.
          </p>

          {orderId && (
            <p className="text-sm text-gray-500 mb-6 break-all">
              Order reference: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <Link
            href="/"
            className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    </>
  );
}
