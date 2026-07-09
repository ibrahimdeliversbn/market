import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TestConnection() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('test.connection').select('*')
      if (error) setError(error.message)
      else setData(data)
    }
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
      )}
      {!data && !error && <p>Loading...</p>}
    </div>
  )
}