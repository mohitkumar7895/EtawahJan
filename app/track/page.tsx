'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, FileText, Clock, CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface ApplicationStatus {
  trackingId: string;
  name: string;
  service_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  remarks: string;
  submittedAt: string;
  updatedAt: string;
  completedAt?: string;
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState('');
  const [mobile, setMobile] = useState('');
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load tracking ID from URL query parameter
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setTrackingId(id);
    }
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'in_progress':
        return <Loader className="w-5 h-5 animate-spin" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'पूर्ण / Completed';
      case 'in_progress':
        return 'प्रगति में / In Progress';
      case 'rejected':
        return 'अस्वीकृत / Rejected';
      default:
        return 'लंबित / Pending';
    }
  };

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setLoading(true);
    setError('');
    setApplication(null);

    try {
      const params = new URLSearchParams();
      if (trackingId.trim()) {
        params.append('id', trackingId.trim());
      } else if (mobile.trim()) {
        params.append('mobile', mobile.trim());
      } else {
        setError('कृपया Tracking ID या Mobile Number दर्ज करें / Please enter Tracking ID or Mobile Number');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/applications/${trackingId.trim() || 'search'}?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Application not found');
      } else {
        setApplication(data.application);
      }
    } catch (err: any) {
      setError('Error tracking application. Please try again.');
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                Track Your Application
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600">
                आवेदन की स्थिति जांचें / Check Application Status
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
              <form onSubmit={handleTrack} className="space-y-4">
                <div>
                  <label htmlFor="trackingId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tracking ID (अगर आपके पास है) / If you have it
                  </label>
                  <input
                    type="text"
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value);
                      setMobile(''); // Clear mobile when tracking ID is entered
                    }}
                    placeholder="Enter Tracking ID (e.g., JSK12345678)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>

                <div className="text-center text-gray-500 font-semibold">OR</div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number / मोबाइल नंबर
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      setTrackingId(''); // Clear tracking ID when mobile is entered
                    }}
                    placeholder="Enter 10 digit mobile number"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Track Application</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Application Status */}
            {application && (
              <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Application Status
                  </h2>
                  <p className="text-gray-600">आवेदन की स्थिति</p>
                </div>

                <div className="space-y-4">
                  {/* Status Badge */}
                  <div className={`border-2 rounded-lg p-4 flex items-center gap-3 ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <div>
                      <p className="font-bold text-lg">{getStatusText(application.status)}</p>
                      <p className="text-sm opacity-80">Status: {application.status}</p>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600">Tracking ID</p>
                        <p className="text-lg font-bold text-gray-900 font-mono">{application.trackingId}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600">Name / नाम</p>
                        <p className="text-lg text-gray-900">{application.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600">Service / सेवा</p>
                        <p className="text-lg text-gray-900">{application.service_type}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-600">Submitted On / आवेदन दिनांक</p>
                        <p className="text-lg text-gray-900">
                          {new Date(application.submittedAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    {application.completedAt && (
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600">Completed On / पूर्ण दिनांक</p>
                          <p className="text-lg text-gray-900">
                            {new Date(application.completedAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    {application.remarks && (
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-600">Remarks / टिप्पणी</p>
                          <p className="text-lg text-gray-900">{application.remarks}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Need Help?</strong> Contact us at:
                    </p>
                    <p className="text-base text-gray-900">
                      📞 <a href="tel:7895094129" className="text-blue-600 hover:text-blue-700 font-semibold">7895094129, 9193898182</a>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      📍 Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 mt-6 sm:mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Track? / कैसे ट्रैक करें?</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                  <p>Enter your Tracking ID (received via email) or Mobile Number used during application</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                  <p>Click on &quot;Track Application&quot; button</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                  <p>View your application status and details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}

