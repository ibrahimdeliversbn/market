import Head from 'next/head';

export default function Home() {
  return(
    <>
      <Head>
        <title>Next.js App</title>
      </Head>
      <header className="flex flex-col items-center justify-center mb-2 pt-2">
        <img src="/logo.png" alt="Ibrahim Delivers BN Logo" className="h-60 w-auto mb-2" />
        <h1 className="text-3xl font-bold">Welcome to my app!</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {sampleProducts.map((product, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md m-2 p-4">
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="mb-4 text-gray-700">{product.description}</p>
          </div>
        ))}
      </main>
    </>
  );
}

const sampleProducts = [
  { name: 'Product 1', description: 'This is the first product.' },
  { name: 'Product 2', description: 'This is the second product.' },
  { name: 'Product 3', description: 'This is the third product.' },
];