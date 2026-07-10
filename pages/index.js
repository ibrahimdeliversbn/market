import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [basket, setBasket] = useState([]);

  const product = {
    name: "Ibrahims Blouse",
    price: 14.99
  };

  const addToBasket = () => {
    setBasket((prevBasket) => [...prevBasket, product]);
  };

  return (
    <>
      <Head>
        <title>Next.js App</title>
      </Head>
      <header className="flex flex-col items-center justify-center mb-2 pt-2">
        <img src="/logo.png" alt="Ibrahim Delivers BN Logo" className="h-60 w-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Ibrahim's Market</h1>
        <div className="mt-4 text-lg font-semibold bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md border border-gray-200">
          Basket: {basket.length} {basket.length === 1 ? 'item' : 'items'}
        </div>
      </header>
      <main className="grid grid-cols-1 justify-items-center p-4">
        <div className="bg-white rounded-lg shadow-md m-2 p-6 max-w-sm w-full border border-gray-200 text-center">
          <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h2>
          <p className="text-lg font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
          <button
            onClick={addToBasket}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Add to Basket
          </button>
        </div>
      </main>
    </>
  );
}
