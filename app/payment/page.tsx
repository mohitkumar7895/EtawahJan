'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IndianRupee, CreditCard, Loader2, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      setError('Failed to load payment gateway. Please refresh the page.');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const paymentAmount = parseFloat(amount);

      // Validate amount
      if (!paymentAmount || paymentAmount < 1) {
        setError('Please enter a valid amount (minimum ₹1)');
        setLoading(false);
        return;
      }

      if (paymentAmount > 1000000) {
        setError('Maximum payment amount is ₹10,00,000');
        setLoading(false);
        return;
      }

      // Check if Razorpay is loaded
      if (!razorpayLoaded || !window.Razorpay) {
        setError('Payment gateway is loading. Please wait a moment and try again.');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      // Check if response is JSON
      const contentType = orderResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await orderResponse.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server error: Invalid response format. Please check if Razorpay keys are configured.');
      }

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        const errorMsg = orderData.error || orderData.message || 'Failed to create payment order';
        
        // Provide helpful message if keys are not configured
        if (errorMsg.includes('not configured') || errorMsg.includes('RAZORPAY')) {
          throw new Error(
            'Payment gateway not configured.\n\n' +
            'Please add Razorpay keys to your .env.local file:\n' +
            '1. Get keys from https://dashboard.razorpay.com → Settings → API Keys\n' +
            '2. Add to .env.local:\n' +
            '   RAZORPAY_KEY_ID=your_key_id\n' +
            '   RAZORPAY_KEY_SECRET=your_key_secret\n' +
            '3. Restart dev server (npm run dev)'
          );
        }
        
        throw new Error(errorMsg);
      }

      // Razorpay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Jan Seva Kendra',
        description: 'Payment for Jan Seva Kendra Services',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount,
                receipt: orderData.receipt,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Redirect to success page with payment details
              router.push(
                `/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&amount=${paymentAmount}`
              );
            } else {
              // Redirect to failure page
              router.push(`/payment/failed?error=${encodeURIComponent(verifyData.error || 'Payment verification failed')}`);
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            router.push('/payment/failed?error=Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#2563eb', // Blue color matching your theme
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled by user');
          },
        },
      };

      // Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setLoading(false);
        router.push(`/payment/failed?error=${encodeURIComponent(response.error.description || 'Payment failed')}`);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      const errorMessage = err.message || 'Failed to process payment. Please try again.';
      
      // Show user-friendly error message
      if (errorMessage.includes('not configured') || errorMessage.includes('RAZORPAY')) {
        setError(
          'Payment gateway not configured.\n\n' +
          'Please follow these steps:\n' +
          '1. Get Razorpay keys from https://dashboard.razorpay.com\n' +
          '2. Add to .env.local file:\n' +
          '   RAZORPAY_KEY_ID=your_key_id\n' +
          '   RAZORPAY_KEY_SECRET=your_key_secret\n' +
          '3. Restart dev server (Ctrl+C then npm run dev)\n\n' +
          'See SETUP_RAZORPAY.md for detailed instructions.'
        );
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  // Predefined amount buttons
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Make Payment
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Pay securely for Jan Seva Kendra services
              </p>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Enter Amount (₹)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError(null);
                      }}
                      placeholder="0.00"
                      min="1"
                      max="1000000"
                      step="0.01"
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-lg"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Quick Amount Buttons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quick Select
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => {
                          setAmount(quickAmount.toString());
                          setError(null);
                        }}
                        disabled={loading}
                        className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        ₹{quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Pay Now Button */}
                <button
                  type="submit"
                  disabled={loading || !razorpayLoaded || !amount}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>

                {/* Security Note */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">
                    🔒 Secure payment powered by Razorpay
                  </p>
                  {razorpayLoaded && (
                    <p className="text-xs text-blue-600 font-medium">
                      {process.env.NEXT_PUBLIC_RAZORPAY_MODE === 'live' 
                        ? '💳 Live Mode - Real Payments Enabled' 
                        : '🧪 Test Mode - Use test card: 4111 1111 1111 1111'}
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center">
                <strong>Note:</strong> After successful payment, you will receive a payment confirmation.
                For any queries, contact us at{' '}
                <a
                  href="tel:7895094129"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  7895094129, 9193898182
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

