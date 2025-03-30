import './styles/globals.css'

export const metadata = {
  title: "Pickle's Plan",
  description: 'Puppy Schedule Assistant for Pickle',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4a90e2" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <div className="container">
          <header className="py-6 border-b border-gray-100 mb-6 text-center">
            <h1 className="text-2xl font-semibold">Pickle's Plan</h1>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
} 