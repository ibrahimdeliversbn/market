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

  // Tracks selected option values per product: { [productId]: { option1: 'Blue', option2: 'Medium' } }
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchProductsAndVariants = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: true });
        if (productsError) throw productsError;

        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .order('id', { ascending: true });
        if (variantsError) throw variantsError;

        const variantsByProduct = variantsData.reduce((acc, variant) => {
          const pid = variant.product_id;
          if (!acc[pid]) acc[pid] = [];
          acc[pid].push(variant);
          return acc;
        }, {});

        const enriched = productsData.map((p) => ({
          ...p,
          variants: variantsByProduct[p.id] || [],
        }));
        setProducts(enriched || []);
      } catch (err) {
        console.error('Error fetching products or variants:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndVariants();
  }, []);

  const totalItems = isHydrated ? basket.reduce((total, item) => total + item.quantity, 0) : 0;

  // Known logical ordering for common size labels. Anything not in this list
  // falls back to the end, sorted alphabetically among itself.
  const SIZE_ORDER = ['XS', 'S', 'Small', 'M', 'Medium', 'L', 'Large', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL'];

  const sortValues = (values) => {
    return [...values].sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1; // known sizes come before unknown values
      if (bIndex !== -1) return 1;
      return a.localeCompare(b); // fallback: alphabetical (e.g. colours)
    });
  };

  // Get distinct values for a given option slot (1 or 2) across a product's variants
  const getDistinctValues = (variants, slot) => {
    const key = slot === 1 ? 'option1_value' : 'option2_value';
    const values = variants.map((v) => v[key]).filter((v) => v !== null && v !== undefined);
    return sortValues([...new Set(values)]);
  };

  const handleSelectOption = (productId, slot, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [slot === 1 ? 'option1' : 'option2']: value,
      },
    }));
  };

  // Find the matching variant row for a product given the currently selected options
  const findMatchingVariant = (product) => {
    const selection = selectedOptions[product.id] || {};
    return product.variants.find((v) => {
      const option1Matches = !product.option1_name || v.option1_value === selection.option1;
      const option2Matches = !product.option2_name || v.option2_value === selection.option2;
      return option1Matches && option2Matches;
    });
  };

  // Whether all required options have been selected for a product
  const isSelectionComplete = (product) => {
    if (!product.option1_name && !product.option2_name) return true; // no variants needed
    const selection = selectedOptions[product.id] || {};
    const option1Ok = !product.option1_name || !!selection.option1;
    const option2Ok = !product.option2_name || !!selection.option2;
    return option1Ok && option2Ok;
  };

  // Whether a specific option button should be disabled because that value has
  // no available variant given the current selection state
  const isOptionValueUnavailable = (product, slot, value) => {
    const selection = selectedOptions[product.id] || {};
    const candidateVariants = product.variants.filter((v) => {
      if (slot === 1) {
        const otherMatches = !product.option2_name || v.option2_value === selection.option2 || !selection.option2;
        return v.option1_value === value && otherMatches;
      } else {
        const otherMatches = !product.option1_name || v.option1_value === selection.option1 || !selection.option1;
        return v.option2_value === value && otherMatches;
      }
    });
    if (candidateVariants.length === 0) return false; // no data either way, don't block
    return candidateVariants.every((v) => v.is_available === false);
  };

  const handleAddToBasket = (product) => {
    const hasVariants = !!(product.option1_name || product.option2_name);

    if (!hasVariants) {
      addToBasket(product);
      return;
    }

    const variant = findMatchingVariant(product);
    if (!variant) return; // shouldn't happen if button is properly disabled

    const selection = selectedOptions[product.id] || {};

    addToBasket({
      ...product,
      id: variant.id, // distinct basket line per variant
      price: variant.price ?? product.price,
      image_url: variant.image_url ?? product.image_url,
      selectedOptions: {
        ...(product.option1_name ? { [product.option1_name]: selection.option1 } : {}),
        ...(product.option2_name ? { [product.option2_name]: selection.option2 } : {}),
      },
    });
  };

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
        {!loading && !error && products.map((product) => {
          const hasVariants = !!(product.option1_name || product.option2_name);
          const selection = selectedOptions[product.id] || {};
          const canAdd = isSelectionComplete(product);

          return (
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

              {hasVariants && product.option1_name && (
                <div className="mb-3 text-left">
                  <p className="text-xs font-medium text-gray-500 mb-1">{product.option1_name}</p>
                  <div className="flex flex-wrap gap-2">
                    {getDistinctValues(product.variants, 1).map((value) => {
                      const isSelected = selection.option1 === value;
                      const isUnavailable = isOptionValueUnavailable(product, 1, value);
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => handleSelectOption(product.id, 1, value)}
                          className={`px-3 py-1 text-sm rounded-md border transition duration-150 ${
                            isUnavailable
                              ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-gray-800 text-white border-gray-800'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {hasVariants && product.option2_name && (
                <div className="mb-3 text-left">
                  <p className="text-xs font-medium text-gray-500 mb-1">{product.option2_name}</p>
                  <div className="flex flex-wrap gap-2">
                    {getDistinctValues(product.variants, 2).map((value) => {
                      const isSelected = selection.option2 === value;
                      const isUnavailable = isOptionValueUnavailable(product, 2, value);
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={isUnavailable}
                          onClick={() => handleSelectOption(product.id, 2, value)}
                          className={`px-3 py-1 text-sm rounded-md border transition duration-150 ${
                            isUnavailable
                              ? 'border-gray-200 text-gray-300 line-through cursor-not-allowed'
                              : isSelected
                              ? 'bg-gray-800 text-white border-gray-800'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAddToBasket(product)}
                disabled={hasVariants && !canAdd}
                className={`font-semibold py-2 px-4 rounded-lg transition duration-200 ${
                  hasVariants && !canAdd
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {hasVariants && !canAdd ? 'Select options' : 'Add to Basket'}
              </button>
            </div>
          );
        })}
      </main>
      <BasketDrawer />
    </>
  );
}
