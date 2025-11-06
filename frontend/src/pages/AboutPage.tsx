import { CheckCircle, Clock, Shield, Users, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">About Jan Seva Kendra</h1>
              <p className="text-2xl text-gray-600">हमारे बारे में - सेवा ही धर्म है</p>
            </div>

            {/* Main About Content */}
            <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Jan Seva Kendra</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  जन सेवा केंद्र एक विश्वसनीय और प्रतिष्ठित सेवा केंद्र है जो सभी प्रकार की सरकारी और निजी सेवाएं एक ही छत के नीचे प्रदान करता है। 
                  हमारा मिशन है समाज के हर वर्ग को सुलभ, पारदर्शी और कुशल सेवाएं प्रदान करना।
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Jan Seva Kendra is a trusted and reputable service center that provides all types of government and private services under one roof. 
                  Our mission is to provide accessible, transparent, and efficient services to every section of society.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  हम अपने ग्राहकों को तेज, सटीक और पारदर्शी सेवा देने के लिए प्रतिबद्ध हैं। हमारा लक्ष्य है कि हमारे समुदाय के हर व्यक्ति को 
                  सरकारी और निजी सेवाएं आसानी से उपलब्ध हों। We are committed to providing fast, accurate, and transparent services to our customers.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Service</h3>
                    <p className="text-gray-600">गुणवत्तापूर्ण सेवा और ग्राहक संतुष्टि हमारी प्राथमिकता है। Quality service and customer satisfaction is our priority.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Processing</h3>
                    <p className="text-gray-600">न्यूनतम समय में आपके काम को पूरा करने की गारंटी। Guaranteed completion of your work in minimum time.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-full flex-shrink-0">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
                    <p className="text-gray-600">आपके दस्तावेज़ों की पूर्ण सुरक्षा और गोपनीयता। Complete security and confidentiality of your documents.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-full flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
                    <p className="text-gray-600">अनुभवी और प्रशिक्षित टीम द्वारा सेवा प्रदान। Service provided by experienced and trained team.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full flex-shrink-0">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Services</h3>
                    <p className="text-gray-600">सभी सेवाएं प्रमाणित और वैधानिक रूप से मान्य हैं। All services are certified and legally valid.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start space-x-4">
                  <div className="bg-teal-100 p-3 rounded-full flex-shrink-0">
                    <Target className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
                    <p className="text-gray-600">ग्राहक की जरूरत हमारी प्राथमिकता है। Customer needs are our priority.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Contact Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Location</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Address</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Mandi Trihaa, Bidhuna Road<br />
                    Bharthana, Etawah<br />
                    Uttar Pradesh, India
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Contact Information</h3>
                  <p className="text-blue-100 mb-2">
                    <strong>Phone:</strong> <a href="tel:9193898182" className="hover:text-white transition">9193898182</a>
                  </p>
                  <p className="text-blue-100">
                    <strong>Email:</strong> <a href="mailto:arpitcsc1707@gmail.com" className="hover:text-white transition">arpitcsc1707@gmail.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


