import '../src/styles.css'
import { BasketProvider } from '../context/BasketContext'

function MyApp({ Component, pageProps }) {
  return (
    <BasketProvider>
      <Component {...pageProps} />
    </BasketProvider>
  )
}

export default MyApp
