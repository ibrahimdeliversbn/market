import Head from 'next/head';
import { useBasket } from '../context/BasketContext';
import { formatCurrency } from '../lib/formatCurrency';
import BasketDrawer from '../components/BasketDrawer';
import { supabase } from '../lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const { basket, addToBasket, openBasket, isHydrated } = useBasket();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });
        if (supabaseError) throw supabaseError;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {loading && <p className="col-span-full text-center">Loading products...</p>}
          {error && <p className="col-span-full text-center text-red-600">Error loading products.</p>}
          {!loading && !error && products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md m-2 p-6 max-w-sm w-full border border-gray-200 text-center"
            >
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-48 w-full object-cover mb-4"
                />
              )}
              <h2 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h2>
               <p className="text-lg font-semibold text-gray-800 mb-4">{formatCurrency(product.price)}</p>
              <button
                onClick={() => addToBasket(product)}
                className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Add to Basket
              </button>
            </div>
          ))}
        </main>
      <BasketDrawer />
    </>
  );
}
