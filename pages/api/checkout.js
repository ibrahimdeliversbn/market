import { createServerClient, serializeCookieHeader } from '@supabase/ssr'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return Object.keys(req.cookies || {}).map((name) => ({
            name,
            value: req.cookies[name] || '',
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.appendHeader('Set-Cookie', serializeCookieHeader(name, value, options))
          })
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { cart, delivery_address_id, payment_method } = req.body

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' })
  }

  if (!delivery_address_id) {
    return res.status(400).json({ error: 'Delivery address is required' })
  }

  const { data: orderId, error: rpcError } = await supabase.rpc('create_order_from_cart', {
    p_customer_id: user.id,
    p_delivery_address_id: delivery_address_id,
    p_cart: cart,
    p_payment_method: payment_method || 'cash_on_delivery',
  })

  if (rpcError) {
    return res.status(400).json({ error: rpcError.message })
  }

  return res.status(200).json({ orderId })
}
