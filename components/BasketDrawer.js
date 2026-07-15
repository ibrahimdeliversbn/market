import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/formatCurrency';
import { supabase } from '../lib/supabaseClient';

export default function BasketDrawer() {
  const router = useRouter();
  const { cart, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [existingAddress, setExistingAddress] = useState(null);
  const [addressInput, setAddressInput] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null);
      setAuthChecked(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // Once we know who's logged in, check if they already have a saved address
  useEffect(() => {
    if (!user) {
      setExistingAddress(null);
      return;
    }

    supabase
      .from('addresses')
      .select('id, address_line')
      .eq('customer_id', user.id)
      .eq('is_default', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching address:', error.message);
          return;
        }
        setExistingAddress(data ?? null);
      });
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleLoginClick = () => {
    closeCart();
    router.push('/login');
  };

  const handlePlaceOrder = async () => {
    setCheckoutError(null);

    let deliveryAddressId = existingAddress?.id;

    // No saved address yet - the customer needs to have typed one in
    if (!deliveryAddressId) {
      if (!addressInput.trim()) {
        setCheckoutError('Please enter a delivery address');
        return;
      }

      const { data: newAddress, error: addressError } = await supabase
        .from('addresses')
        .insert({
          customer_id: user.id,
          label: 'Home',
          address_line: addressInput.trim(),
          is_default: true,
        })
        .select('id')
        .single();

      if (addressError) {
        setCheckoutError(`Could not save address: ${addressError.message}`);
        return;
      }

      deliveryAddressId = newAddress.id;
    }

    setPlacingOrder(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })),
          delivery_address_id: deliveryAddressId,
          payment_method: 'cash_on_delivery',
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setCheckoutError(result.error || 'Checkout failed. Please try again.');
        setPlacingOrder(false);
        return;
      }

      clearCart();
      closeCart();
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    } catch (err) {
      console.error('Checkout request failed:', err);
      setCheckoutError('Something went wrong. Please check your connection and try again.');
      setPlacingOrder(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Your Basket</h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
            aria-label="Close basket"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 && (
            <p className="text-gray-500 text-center mt-8">Your basket is empty.</p>
          )}

          {cart.map((item, index) => (
            <div
              key={`${item.product_id}-${item.variant_id ?? 'novariant'}`}
              className="flex items-start justify-between border-b border-gray-100 py-3"
            >
              <div className="flex-1 pr-2">
                <p className="font-semibold text-gray-800">{item.name}</p>
                {item.variantLabel && (
                  <p className="text-xs text-gray-500">{item.variantLabel}</p>
                )}
                <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between h-full">
                <p className="font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-500 hover:text-red-700 mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between font-bold text-gray-800 mb-3">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            {!authChecked && (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 font-semibold py-2 rounded-lg cursor-not-allowed"
              >
                Checking login...
              </button>
            )}

            {authChecked && !user && (
              <button
                onClick={handleLoginClick}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-200"
              >
                Log in to checkout
              </button>
            )}

            {authChecked && user && (
              <div>
                {existingAddress ? (
                  <p className="text-sm text-gray-600 mb-3">
                    Delivering to: <span className="font-medium">{existingAddress.address_line}</span>
                  </p>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="e.g. Simpang 123, Kg Example, BSB"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                    />
                  </div>
                )}

                {checkoutError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-3">
                    {checkoutError}
                  </p>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  {placingOrder ? 'Placing order...' : 'Place order'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
