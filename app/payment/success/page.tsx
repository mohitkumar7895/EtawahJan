'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Home, Receipt, Download } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentDetails, setPaymentDetails] = useState({
    paymentId: '',
    orderId: '',
    amount: '',
  });

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');

    if (paymentId && orderId && amount) {
      setPaymentDetails({
        paymentId,
        orderId,
        amount,
      });
    } else {
      // Redirect to payment page if details are missing
      router.push('/payment');
    }
  }, [searchParams, router]);

  const handleDownloadReceipt = () => {
    // Create a simple receipt text
    const receiptText = `
PAYMENT RECEIPT
================

Payment ID: ${paymentDetails.paymentId}
Order ID: ${paymentDetails.orderId}
Amount: ₹${paymentDetails.amount}
Date: ${new Date().toLocaleString('en-IN')}
Status: Success

Thank you for your payment!

Jan Seva Kendra
Mandi Trihaa, Bidhuna Road
Bharthana, Etawah, UP
Phone: 9193898182
    `;

    // Create and download file
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payment-receipt-${paymentDetails.paymentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                Your payment has been processed successfully
              </p>
            </div>

            {/* Payment Details Card */}
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 sm:p-8 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Payment ID:</span>
                  <span className="text-gray-900 font-semibold font-mono text-sm">
                    {paymentDetails.paymentId || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Order ID:</span>
                  <span className="text-gray-900 font-semibold font-mono text-sm">
                    {paymentDetails.orderId || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Amount Paid:</span>
                  <span className="text-green-600 font-bold text-xl">
                    ₹{paymentDetails.amount || '0.00'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                    Success
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadReceipt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 text-center mb-2">
                <strong>✅ Payment Successful!</strong> Your payment of ₹{paymentDetails.amount} has been received.
              </p>
              <p className="text-xs text-gray-600 text-center">
                Payment ID: <span className="font-mono">{paymentDetails.paymentId}</span>
              </p>
              <p className="text-xs text-gray-600 text-center mt-2">
                For any queries, contact us at{' '}
                <a
                  href="tel:9193898182"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  9193898182
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

