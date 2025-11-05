export const metadata = {
  title: 'Client Portal | Studio37',
  description: 'Access your private galleries and manage bookings.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
