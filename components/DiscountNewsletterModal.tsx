

'use client';
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { usePathname } from 'next/navigation';



export default function DiscountNewsletterModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const pathname = usePathname();

  useEffect(() => {
    // Don't show modal on admin pages
    if (pathname?.startsWith('/admin')) {
      return;
    }

    // Show modal after 3 seconds delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Insert lead into Supabase CRM
    const { error } = await supabase
      .from('leads')
      .insert({ name, email, phone });
    if (error) {
      setError('Sorry, there was a problem saving your info. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>
        {submitted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-green-600">Thank you!</h2>
            <p className="text-gray-700 mb-4">You're entered for 15% off and our weekly giveaways!</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2 text-amber-600">Get 15% Off Your First Shoot!</h2>
            <p className="text-gray-700 mb-4">
              Join our weekly newsletter for a chance to win discounts, giveaways, and free shoots.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                required
                placeholder="Full name"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <input
                type="email"
                required
                placeholder="Email address"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="tel"
                required
                placeholder="Phone number"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button
                type="submit"
                className="w-full bg-amber-600 text-white font-bold py-2 rounded hover:bg-amber-700 transition"
              >
                Claim Discount & Enter Giveaway
              </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
            <p className="text-xs text-gray-400 mt-2 text-center">
              No spam. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
