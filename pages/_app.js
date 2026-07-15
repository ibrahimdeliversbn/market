import '../src/styles.css'
import { CartProvider } from '../context/CartContext'
import BasketDrawer from '../components/BasketDrawer'

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <BasketDrawer />
    </CartProvider>
  )
}

export default MyApp
