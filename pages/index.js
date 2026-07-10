import Head from 'next/head';
import { useBasket } from '../context/BasketContext';
import BasketDrawer from '../components/BasketDrawer';

export default function Home() {
  const { basket, addToBasket, openBasket, isHydrated } = useBasket();

  const product = {
    id: 'ibrahims-blouse',
    name: "Ibrahims Blouse",
    price: 14.99
  };

  // Calculate total number of items in the basket (sum of quantities)
  const totalItems = isHydrated ? basket.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <>
      <Head>
        <title>Next.js App</title>
      </Head>
      <header className="flex flex-col items-center justify-center mb-2 pt-2">
        <img src="/logo.png" alt="Ibrahim Delivers BN Logo" className="h-60 w-auto mb-2" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center px-4 break-words">Welcome to Ibrahim's Market</h1>
        <button
          onClick={openBasket}
          className="mt-4 text-lg font-semibold bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition duration-200 cursor-pointer flex items-center gap-2"
        >
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Basket: {totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </button>
      </header>
      <main className="grid grid-cols-1 justify-items-center p-4">
        <div className="bg-white rounded-lg shadow-md m-2 p-6 max-w-sm w-full border border-gray-200 text-center">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h2>
          <p className="text-lg font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
          <button
            onClick={() => addToBasket(product)}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Add to Basket
          </button>
        </div>
      </main>
      <BasketDrawer />
    </>
  );
}
