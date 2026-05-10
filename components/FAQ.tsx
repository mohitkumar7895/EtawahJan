'use client';

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  questionHindi: string;
  answer: string;
  answerHindi: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What services does Jan Seva Kendra provide?',
    questionHindi: 'जन सेवा केंद्र कौन-कौन सी सेवाएं प्रदान करता है?',
    answer: 'We provide all government and private services including PAN Card, Voter ID, Ration Card, Certificates (Birth, Death, Marriage, Income, Caste, Domicile), Driving License, Vehicle Registration, Insurance, Government Schemes (PM Awas, Ujjwala, PM Kisan), Bill Payments, Banking Services, and many more.',
    answerHindi: 'हम सभी सरकारी और निजी सेवाएं प्रदान करते हैं जैसे पैन कार्ड, वोटर आईडी, राशन कार्ड, प्रमाणपत्र (जन्म, मृत्यु, विवाह, आय, जाति, डोमिसाइल), ड्राइविंग लाइसेंस, वाहन पंजीकरण, बीमा, सरकारी योजनाएं (पीएम आवास, उज्ज्वला, पीएम किसान), बिल भुगतान, बैंकिंग सेवाएं और बहुत कुछ।',
    category: 'General',
  },
  {
    question: 'How can I apply for a service?',
    questionHindi: 'मैं सेवा के लिए कैसे आवेदन कर सकता हूं?',
    answer: 'You can apply for any service by visiting our website, selecting the service you need, filling out the application form with your details, and submitting it. Our team will contact you soon. You can also visit our center directly or call us at 9193898182, 7895094129.',
    answerHindi: 'आप हमारी वेबसाइट पर जाकर, अपनी आवश्यक सेवा का चयन करके, अपनी जानकारी के साथ आवेदन फॉर्म भरकर और सबमिट करके किसी भी सेवा के लिए आवेदन कर सकते हैं। हमारी टीम जल्द ही आपसे संपर्क करेगी। आप सीधे हमारे केंद्र पर भी जा सकते हैं या हमें 9193898182, 7895094129 पर कॉल कर सकते हैं।',
    category: 'General',
  },

  {
    question: 'How long does it take to process an application?',
    questionHindi: 'आवेदन प्रसंस्करण में कितना समय लगता है?',
    answer: 'Processing time varies depending on the service. Simple services like bill payments are instant, while document services may take 7-15 days. Government scheme applications may take 15-30 days. Our team will keep you updated about the status.',
    answerHindi: 'प्रसंस्करण समय सेवा के आधार पर भिन्न होता है। बिल भुगतान जैसी सरल सेवाएं तत्काल होती हैं, जबकि दस्तावेज सेवाएं 7-15 दिन ले सकती हैं। सरकारी योजना आवेदन 15-30 दिन ले सकते हैं। हमारी टीम आपको स्थिति के बारे में अपडेट रखेगी।',
    category: 'General',
  },
  {
    question: 'How can I track my application status?',
    questionHindi: 'मैं अपने आवेदन की स्थिति कैसे ट्रैक कर सकता हूं?',
    answer: 'You can track your application by visiting the "Track Application" page on our website. Enter your Tracking ID (received via email) or Mobile Number used during application. You will see the current status, submission date, and any remarks.',
    answerHindi: 'आप हमारी वेबसाइट पर "Track Application" पेज पर जाकर अपने आवेदन को ट्रैक कर सकते हैं। अपना Tracking ID (ईमेल के माध्यम से प्राप्त) या आवेदन के दौरान उपयोग किया गया मोबाइल नंबर दर्ज करें। आप वर्तमान स्थिति, सबमिशन तिथि और कोई भी टिप्पणी देखेंगे।',
    category: 'General',
  },
  {
    question: 'What are your working hours?',
    questionHindi: 'आपके काम के घंटे क्या हैं?',
    answer: 'We are open Monday to Saturday from 9:00 AM to 7:00 PM, and on Sunday from 10:00 AM to 5:00 PM. You can visit us during these hours or contact us via phone/email.',
    answerHindi: 'हम सोमवार से शनिवार सुबह 9:00 बजे से शाम 7:00 बजे तक और रविवार को सुबह 10:00 बजे से शाम 5:00 बजे तक खुले रहते हैं। आप इन घंटों के दौरान हमसे मिल सकते हैं या फोन/ईमेल के माध्यम से संपर्क कर सकते हैं।',
    category: 'General',
  },
  {
    question: 'Do you charge any fees for services?',
    questionHindi: 'क्या आप सेवाओं के लिए कोई शुल्क लेते हैं?',
    answer: 'Yes, we charge reasonable fees for our services. The fee varies depending on the type of service. Government services have standard fees as per government guidelines, and we also charge a small service fee. All fees are transparent with no hidden charges.',
    answerHindi: 'हां, हम अपनी सेवाओं के लिए उचित शुल्क लेते हैं। शुल्क सेवा के प्रकार के आधार पर भिन्न होता है। सरकारी सेवाओं के लिए सरकारी दिशानिर्देशों के अनुसार मानक शुल्क हैं, और हम एक छोटा सा सेवा शुल्क भी लेते हैं। सभी शुल्क पारदर्शी हैं, कोई छुपी हुई फीस नहीं है।',
    category: 'General',
  },
  {
    question: 'What is PM Kisan Yojana and how to apply?',
    questionHindi: 'पीएम किसान योजना क्या है और कैसे आवेदन करें?',
    answer: 'PM Kisan is a government scheme that provides financial support of ₹6,000 per year to small and marginal farmers in three equal installments. To apply, you need Aadhaar Card, Bank account details, and Land documents. We can help you with the complete application process.',
    answerHindi: 'पीएम किसान एक सरकारी योजना है जो छोटे और सीमांत किसानों को प्रति वर्ष ₹6,000 की वित्तीय सहायता तीन समान किस्तों में प्रदान करती है। आवेदन करने के लिए, आपको आधार कार्ड, बैंक खाता विवरण और भूमि दस्तावेजों की आवश्यकता होती है। हम आपको पूरी आवेदन प्रक्रिया में मदद कर सकते हैं।',
    category: 'Schemes',
  },

  {
    question: 'Can I apply for multiple services at once?',
    questionHindi: 'क्या मैं एक साथ कई सेवाओं के लिए आवेदन कर सकता हूं?',
    answer: 'Yes, you can apply for multiple services. Simply fill out separate application forms for each service, or visit our center and we will help you apply for all services you need at once.',
    answerHindi: 'हां, आप कई सेवाओं के लिए आवेदन कर सकते हैं। बस प्रत्येक सेवा के लिए अलग-अलग आवेदन फॉर्म भरें, या हमारे केंद्र पर जाएं और हम आपको एक साथ सभी आवश्यक सेवाओं के लिए आवेदन करने में मदद करेंगे।',
    category: 'General',
  },
  {
    question: 'What payment methods do you accept?',
    questionHindi: 'आप कौन से भुगतान तरीके स्वीकार करते हैं?',
    answer: 'We accept cash, UPI (PhonePe, Google Pay, Paytm), debit/credit cards, and online bank transfers. You can also pay through our website using secure payment gateways.',
    answerHindi: 'हम नकद, UPI (PhonePe, Google Pay, Paytm), डेबिट/क्रेडिट कार्ड और ऑनलाइन बैंक ट्रांसफर स्वीकार करते हैं। आप सुरक्षित भुगतान गेटवे का उपयोग करके हमारी वेबसाइट के माध्यम से भी भुगतान कर सकते हैं।',
    category: 'General',
  },
  {
    question: 'How to get a Birth Certificate?',
    questionHindi: 'जन्म प्रमाणपत्र कैसे प्राप्त करें?',
    answer: 'To get a Birth Certificate, you need Hospital discharge slip, Parent\'s Aadhaar Card, Parent\'s ID proof, and Marriage certificate. The certificate is issued by the Municipal Corporation or Gram Panchayat. We can help you with the complete process.',
    answerHindi: 'जन्म प्रमाणपत्र प्राप्त करने के लिए, आपको अस्पताल डिस्चार्ज स्लिप, माता-पिता का आधार कार्ड, माता-पिता का पहचान प्रमाण और विवाह प्रमाणपत्र की आवश्यकता होती है। प्रमाणपत्र नगर निगम या ग्राम पंचायत द्वारा जारी किया जाता है। हम आपको पूरी प्रक्रिया में मदद कर सकते हैं।',
    category: 'Documents',
  },
  {
    question: 'Where is Jan Seva Kendra near me? CSC center Etawah address?',
    questionHindi: 'जन सेवा केंद्र नजदीक कहाँ है? सीएससी सेंटर इटावा का पता?',
    answer: 'Jan Seva Kendra / CSC center is at Mandi Trihaa, Bidhuna Road, Bharthana, Etawah, UP. We serve Etawah, Bharthana, Agra, Kanpur, Lucknow, Firozabad, Ekdil, Auraiya within 25 km. Same day work, official process. Call 9193898182, 7895094129 or WhatsApp now. Visit today.',
    answerHindi: 'जन सेवा केंद्र / सीएससी सेंटर मंडी त्रिहा, बिदूना रोड, भरथाना, इटावा, यूपी में है। हम 25 किमी के अंदर इटावा, भरथाना, आगरा, कानपुर, लखनऊ, फिरोजाबाद, एकदिल, औरैया में सेवा देते हैं। समान दिन काम, ऑफिशियल प्रोसेस। कॉल 9193898182, 7895094129 या अभी WhatsApp करें।',
    category: 'General',
  },
  {
    question: 'PAN card apply near Etawah?',
    questionHindi: 'पैन कार्ड इटावा के पास?',
    answer: 'PAN card apply near Etawah—we help with form fill, submission and fast approval. Official process, no agent required. Bring documents and visit Mandi Trihaa, Bidhuna Road, Bharthana. Call now 9193898182.',
    answerHindi: 'पैन कार्ड इटावा के पास—फॉर्म भरना, सबमिशन और फास्ट अप्रूवल में मदद। ऑफिशियल प्रोसेस, एजेंट की जरूरत नहीं। दस्तावेज लेकर मंडी त्रिहा, बिदूना रोड, भरथाना आएं। अभी कॉल 9193898182।',
    category: 'Documents',
  },
  {
    question: 'Income certificate apply near me? Ration card apply? Ayushman card apply?',
    questionHindi: 'आय प्रमाणपत्र नजदीक कहाँ? राशन कार्ड कहाँ बनवाएं? आयुष्मान कार्ड कैसे?',
    answer: 'Income certificate, ration card apply, and Ayushman card apply—all available at Jan Seva Kendra, Bharthana (Mandi Trihaa, Bidhuna Road). Same day application, official process, fast approval help. No agent required. Call 9193898182, 7895094129 or WhatsApp now. Visit today.',
    answerHindi: 'आय प्रमाणपत्र, राशन कार्ड और आयुष्मान कार्ड—सब जन सेवा केंद्र भरथाना (मंडी त्रिहा, बिदूना रोड) पर। समान दिन आवेदन, ऑफिशियल प्रोसेस। एजेंट की जरूरत नहीं। कॉल 9193898182, 7895094129 या अभी WhatsApp। आज ही आएं।',
    category: 'General',
  },
  {
    question: 'Do you provide Website, App, and Game Development services?',
    questionHindi: 'क्या आप वेबसाइट, ऐप और गेम डेवलपमेंट सर्विस देते हैं?',
    answer: 'Yes! We provide premium IT services including custom Website Development, Mobile App Development (Android & iOS), Game Development, and custom Business Software to help you grow your business 10x. Call 9193898182 for a free consultation.',
    answerHindi: 'हाँ! हम आपके बिज़नेस को ग्रो करने के लिए बेहतरीन वेबसाइट डेवलपमेंट, मोबाइल ऐप, गेम डेवलपमेंट और कस्टम सॉफ्टवेयर बनाते हैं। ज्यादा जानकारी और फ्री कंसल्टेशन के लिए अभी 9193898182 पर कॉल करें।',
    category: 'IT Services',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-12 sm:py-16 md:py-20">
      {/* FAQ Schema for SEO / Voice search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Frequently Asked Questions
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              अक्सर पूछे जाने वाले प्रश्न
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOpenIndex(null);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => {
              const actualIndex = faqs.indexOf(faq);
              const isOpen = openIndex === actualIndex;
              
              return (
                <div
                  key={actualIndex}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(actualIndex)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-blue-50 transition"
                  >
                    <div className="flex-1 pr-4">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                        {faq.question}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {faq.questionHindi}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-gray-200 bg-gray-50">
                      <div className="pt-4 space-y-3">
                        <div>
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                        <div className="border-t border-gray-300 pt-3">
                          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                            {faq.answerHindi}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-8 sm:mt-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-xl p-6 sm:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Still have questions? / अभी भी प्रश्न हैं?
            </h3>
            <p className="text-blue-100 mb-4 sm:mb-5">
              If you have any other questions, feel free to contact us. We are here to help you!
              <br />
              यदि आपके कोई अन्य प्रश्न हैं, तो बेझिझक हमसे संपर्क करें। हम आपकी मदद के लिए यहां हैं!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
              <a
                href="tel:9193898182"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition text-center"
              >
                📞 Call: 9193898182, 7895094129
              </a>
              <a
                href="https://wa.me/9193898182"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition text-center"
              >
                💬 WhatsApp Now
              </a>
              <a
                href="/contact"
                className="bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition text-center"
              >
                📧 Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

