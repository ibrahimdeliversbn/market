import { useBasket } from '../context/BasketContext';

export default function BasketDrawer() {
  const { basket, isOpen, closeBasket, isHydrated, removeFromBasket, updateQuantity } = useBasket();

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Dark overlay */}
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={closeBasket}
        ></div>

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">
                  Shopping Basket
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
                    onClick={closeBasket}
                  >
                    <span className="absolute -inset-0.5"></span>
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Basket list */}
              <div className="flex-1 py-6 px-4 sm:px-6">
                {!isHydrated ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">Loading basket...</p>
                  </div>
                ) : basket.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">Basket is empty</h3>
                    <p className="mt-1 text-sm text-gray-500">Start adding some items to your basket!</p>
                  </div>
                ) : (
                  <div className="flow-root">
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                      {basket.map((item) => (
                        <li key={item.id} className="flex py-6">
                          <div className="flex flex-1 flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Qty</span>
                                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                                  <button
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="px-3 py-1 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition duration-150 bg-gray-50"
                                    type="button"
                                  >
                                    -
                                  </button>
                                  <span className="px-3 text-gray-800 font-semibold">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="px-3 py-1 font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition duration-150 bg-gray-50"
                                    type="button"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              {isHydrated && basket.length > 0 && (
                <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                      className="flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700 w-full transition duration-200"
                    >
                      Checkout
                    </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        className="font-medium text-gray-600 hover:text-gray-500 underline"
                        onClick={closeBasket}
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
