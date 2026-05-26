import type { ApplicationTemplate } from './types';

/** Misc / general-purpose application templates — bilingual. */
export const MISC_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'self-declaration',
    titleEn: 'Self Declaration / Self Attestation',
    titleHi: 'स्व-घोषणा / स्व-सत्यापन प्रमाण पत्र',
    category: 'misc',
    description: 'KYC / admission / job ke liye self declaration letter.',
    keywords: [
      'self declaration',
      'self attestation',
      'self affidavit',
      'sworn declaration',
      'स्व-घोषणा',
    ],
    recipientLines: {
      en: ['To,', 'Whom It May Concern'],
      hi: ['प्रति,', 'जिनसे यह सम्बन्धित हो'],
    },
    subject: {
      en: 'Self Declaration regarding {{subjectMatter}}.',
      hi: '{{subjectMatter}} के सम्बन्ध में स्व-घोषणा।',
    },
    body: {
      en: `I, {{fullName}}, son/daughter of Shri {{fatherName}}, aged {{applicantAge}} years, resident of {{address}}, do hereby solemnly affirm and declare as under:

1. That I am a citizen of India.
2. That all information given by me in respect of {{subjectMatter}} is true to the best of my knowledge and belief.
3. That I am responsible for the correctness of the above information and no facts have been concealed.
4. {{additionalDeclaration}}

I hereby declare that if at any time any of the above information is found to be false, I shall be liable for legal action as per the law.`,
      hi: `मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, आयु {{applicantAge}} वर्ष, निवासी {{address}}, सत्यनिष्ठा से शपथपूर्वक यह घोषणा करता/करती हूँ कि —

1. मैं भारत का नागरिक हूँ।
2. {{subjectMatter}} के सम्बन्ध में मेरे द्वारा दी गई समस्त जानकारी मेरी जानकारी एवं विश्वास के अनुसार पूर्णतः सत्य है।
3. उपर्युक्त जानकारी की सत्यता का उत्तरदायित्व मेरा है तथा मैंने कोई भी तथ्य नहीं छिपाया है।
4. {{additionalDeclaration}}

मैं घोषणा करता/करती हूँ कि यदि किसी भी समय उपर्युक्त जानकारी में से कोई भी असत्य पायी जाती है तो मैं विधि के अनुसार समस्त कानूनी कार्रवाई के लिए उत्तरदायी रहूँगा/रहूँगी।`,
    },
    fields: [
      { id: 'applicantAge', label: 'Your age', type: 'number', required: true },
      { id: 'subjectMatter', label: 'Declaration about', type: 'text', required: true, hint: 'employment / income / address' },
      { id: 'additionalDeclaration', label: 'Additional declaration', type: 'textarea', rows: 3, hint: 'जैसे — मैं कहीं और नौकरीरत नहीं हूँ' },
    ],
  },

  {
    slug: 'affidavit-name-change',
    titleEn: 'Affidavit for Name / Religion / DOB Change',
    titleHi: 'नाम / धर्म / जन्म तिथि परिवर्तन शपथ पत्र',
    category: 'misc',
    description: 'Naam / dharma / DOB officially change karne ka affidavit.',
    keywords: [
      'affidavit name change',
      'religion change affidavit',
      'DOB change affidavit',
      'name correction letter',
      'शपथ पत्र नाम परिवर्तन',
    ],
    recipientLines: {
      en: ['Before,', 'The Notary Public / Oath Commissioner,', 'District {{district}}'],
      hi: ['समक्ष,', 'श्रीमान नोटरी पब्लिक / शपथ आयुक्त महोदय,', 'जनपद {{district}}'],
    },
    subject: {
      en: 'Affidavit for change of {{changeType}} from "{{oldValue}}" to "{{newValue}}".',
      hi: '{{changeType}} "{{oldValue}}" से "{{newValue}}" परिवर्तन हेतु शपथ पत्र।',
    },
    body: {
      en: `I, {{fullName}}, son/daughter of Shri {{fatherName}}, aged {{applicantAge}} years, resident of {{address}}, do hereby solemnly affirm and declare as under:

1. That my {{changeType}} as recorded in earlier documents was "{{oldValue}}".
2. That I have, of my own free will and accord, decided to change my {{changeType}} from "{{oldValue}}" to "{{newValue}}" with immediate effect.
3. That henceforth I shall be known by the new {{changeType}} "{{newValue}}" for all purposes — official, social, financial and otherwise.
4. That both the old and new {{changeType}} refer to one and the same person, i.e. myself.

I hereby declare that all the contents of this affidavit are true to the best of my knowledge and that no part of it is false.`,
      hi: `मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, आयु {{applicantAge}} वर्ष, निवासी {{address}}, सत्यनिष्ठा से शपथ लेकर यह घोषणा करता/करती हूँ कि —

1. पूर्व अभिलेखों में मेरा {{changeType}} "{{oldValue}}" अंकित था।
2. मैंने अपनी स्वतन्त्र एवं स्वेच्छा से अपना {{changeType}} "{{oldValue}}" से बदलकर "{{newValue}}" करने का निर्णय लिया है, जो तत्काल प्रभाव से लागू होगा।
3. भविष्य में मैं समस्त उद्देश्यों — आधिकारिक, सामाजिक, वित्तीय एवं अन्य — हेतु नये {{changeType}} "{{newValue}}" से जाना/जानी जाऊँगा/जाऊँगी।
4. पुराना एवं नया {{changeType}} एक ही व्यक्ति अर्थात मेरा है।

मैं घोषणा करता/करती हूँ कि उक्त शपथ पत्र की सम्पूर्ण विषयवस्तु मेरी जानकारी के अनुसार पूर्णतः सत्य है तथा इसमें कुछ भी असत्य नहीं है।`,
    },
    fields: [
      { id: 'applicantAge', label: 'Your age', type: 'number', required: true },
      { id: 'changeType', label: 'What to change', type: 'text', required: true, hint: 'name / father name / religion / DOB' },
      { id: 'oldValue', label: 'Old value', type: 'text', required: true },
      { id: 'newValue', label: 'New value', type: 'text', required: true },
    ],
  },

  {
    slug: 'authorization-letter',
    titleEn: 'Authorization Letter',
    titleHi: 'अधिकार पत्र (Authorization)',
    category: 'misc',
    description: 'Kisi vyakti ko apni ore se kaam karne ki authority dene ka patra.',
    keywords: [
      'authorization letter',
      'authority letter',
      'power of attorney letter',
      'permit someone collect',
      'अधिकार पत्र',
    ],
    recipientLines: {
      en: ['To,', 'Whom It May Concern'],
      hi: ['प्रति,', 'जिनसे यह सम्बन्धित हो'],
    },
    subject: {
      en: 'Authorization Letter in favour of Shri / Smt. {{authorizedName}} for {{taskDescription}}.',
      hi: 'श्री/श्रीमती {{authorizedName}} को {{taskDescription}} हेतु अधिकृत करने सम्बन्धी पत्र।',
    },
    body: {
      en: `I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, do hereby authorize Shri / Smt. {{authorizedName}}, son/daughter of {{authorizedRelation}}, holder of Aadhaar No. ending {{authorizedAadhaar}}, to act on my behalf for the following purpose:

{{taskDescription}}

This authorization shall remain valid from {{validFrom}} to {{validTo}}. The authorized person shall be entitled to sign all necessary documents, receive any payment / item, and perform all reasonable acts on my behalf in connection with the above task. I shall be responsible for all such acts done by the authorized person on my behalf.

Photocopies of my Aadhaar and the authorized person's Aadhaar, both self-attested, are enclosed.`,
      hi: `मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, यह घोषणा करता/करती हूँ कि मैं श्री/श्रीमती {{authorizedName}}, पुत्र/पुत्री {{authorizedRelation}}, आधार संख्या अंतिम 4 अंक — {{authorizedAadhaar}}, को निम्नलिखित कार्य हेतु अपनी ओर से अधिकृत करता/करती हूँ —

{{taskDescription}}

उक्त अधिकार पत्र दिनांक {{validFrom}} से {{validTo}} तक मान्य रहेगा। अधिकृत व्यक्ति को मेरी ओर से समस्त आवश्यक दस्तावेज़ों पर हस्ताक्षर करने, किसी प्रकार का भुगतान / वस्तु प्राप्त करने एवं उक्त कार्य से सम्बन्धित समस्त वैध कार्य करने का अधिकार होगा। अधिकृत व्यक्ति द्वारा मेरी ओर से किए गए समस्त कार्यों का उत्तरदायित्व मेरा होगा।

मेरे एवं अधिकृत व्यक्ति के आधार कार्ड की स्व-प्रमाणित प्रति इस पत्र के साथ संलग्न है।`,
    },
    fields: [
      { id: 'authorizedName', label: 'Authorized person name', type: 'text', required: true },
      { id: 'authorizedRelation', label: "Authorized person's father", type: 'text', required: true },
      { id: 'authorizedAadhaar', label: 'Aadhaar last 4 digits', type: 'text', required: true },
      { id: 'taskDescription', label: 'Purpose / task', type: 'textarea', required: true, rows: 3 },
      { id: 'validFrom', label: 'Valid from', type: 'date', required: true },
      { id: 'validTo', label: 'Valid till', type: 'date', required: true },
    ],
  },

  {
    slug: 'general-noc',
    titleEn: 'General Purpose NOC',
    titleHi: 'सामान्य NOC (No Objection Certificate)',
    category: 'misc',
    description: 'Property / job / vehicle ke liye general No-Objection Certificate.',
    keywords: [
      'general NOC',
      'no objection certificate',
      'NOC letter format',
      'अनापत्ति प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'Whom It May Concern'],
      hi: ['प्रति,', 'जिनसे यह सम्बन्धित हो'],
    },
    subject: {
      en: 'No-Objection Certificate (NOC) in favour of {{beneficiary}}.',
      hi: '{{beneficiary}} के पक्ष में अनापत्ति प्रमाण पत्र (NOC)।',
    },
    body: {
      en: `I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, do hereby state and declare that I have no objection whatsoever in respect of {{noccSubject}} concerning Shri / Smt. {{beneficiary}}.

Brief details: {{noccDetails}}

This No-Objection Certificate is being issued by me of my own free will, without any pressure or coercion, and shall be valid for all legal and official purposes connected with the above subject.`,
      hi: `मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, यह घोषित करता/करती हूँ कि श्री/श्रीमती {{beneficiary}} से सम्बन्धित {{noccSubject}} के विषय में मुझे किसी भी प्रकार की कोई आपत्ति नहीं है।

संक्षिप्त विवरण — {{noccDetails}}

यह अनापत्ति प्रमाण पत्र मेरे द्वारा अपनी पूर्ण स्वतन्त्रता एवं स्वेच्छा से, बिना किसी दबाव / लालच के निर्गत किया जा रहा है तथा उपर्युक्त विषय से सम्बन्धित समस्त वैधानिक एवं आधिकारिक उद्देश्यों के लिए मान्य रहेगा।`,
    },
    fields: [
      { id: 'beneficiary', label: 'NOC in favour of', type: 'text', required: true },
      { id: 'noccSubject', label: 'NOC subject', type: 'text', required: true, hint: 'property / vehicle / job change' },
      { id: 'noccDetails', label: 'Details', type: 'textarea', required: true, rows: 3 },
    ],
  },

  {
    slug: 'complaint-letter-consumer',
    titleEn: 'Consumer Complaint Letter',
    titleHi: 'उपभोक्ता शिकायत पत्र',
    category: 'misc',
    description: 'Defective product / poor service ke against shikayat patra.',
    keywords: [
      'consumer complaint',
      'product complaint letter',
      'service complaint',
      'defective product',
      'refund letter',
      'उपभोक्ता शिकायत',
    ],
    recipientLines: {
      en: ['To,', 'The Customer Service / Grievance Officer,', '{{companyName}}, {{companyAddress}}'],
      hi: ['सेवा में,', 'श्रीमान ग्राहक सेवा / शिकायत निवारण अधिकारी,', '{{companyName}}, {{companyAddress}}'],
    },
    subject: {
      en: 'Complaint regarding {{productOrService}} purchased on {{purchaseDate}} (Order/Bill No. {{orderNumber}}).',
      hi: '{{productOrService}} दिनांक {{purchaseDate}} (आदेश/बिल संख्या {{orderNumber}}) सम्बन्धी शिकायत।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, mobile {{mobile}}, beg to bring to your kind notice the following grievance regarding the {{productOrService}} purchased / availed from your company.

• Order / Bill No.: {{orderNumber}}
• Date of purchase: {{purchaseDate}}
• Amount paid: Rs. {{amountPaid}}
• Issue faced: {{issueDescription}}

Despite repeated requests through your customer-care channels, no satisfactory resolution has been provided so far. As a consumer, I am suffering financial loss and mental harassment.

I, therefore, request you to kindly resolve my grievance by way of {{resolutionRequested}} within {{resolutionDays}} days, failing which I shall be constrained to approach the appropriate Consumer Forum for redressal under the Consumer Protection Act, 2019.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, मोबाइल {{mobile}}, आपकी कम्पनी से क्रय/प्राप्त {{productOrService}} के सम्बन्ध में निम्नलिखित शिकायत प्रस्तुत कर रहा/रही हूँ।

• आदेश / बिल संख्या — {{orderNumber}}
• क्रय तिथि — {{purchaseDate}}
• जमा की गई राशि — रुपये {{amountPaid}}
• शिकायत — {{issueDescription}}

आपके कस्टमर-केयर माध्यमों से बार-बार अनुरोध के बावजूद अभी तक कोई संतोषजनक समाधान प्राप्त नहीं हुआ है। उपभोक्ता के रूप में मुझे आर्थिक हानि एवं मानसिक उत्पीड़न का सामना करना पड़ रहा है।

अतः आपसे विनम्र निवेदन है कि कृपया मेरी शिकायत का समाधान {{resolutionRequested}} के रूप में आगामी {{resolutionDays}} दिवस के भीतर किया जाए, अन्यथा मुझे उपभोक्ता संरक्षण अधिनियम, 2019 के अन्तर्गत सम्बन्धित उपभोक्ता मंच (Consumer Forum) में जाने के लिए बाध्य होना पड़ेगा।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'companyAddress', label: 'Company address', type: 'text' },
      { id: 'productOrService', label: 'Product / service', type: 'text', required: true },
      { id: 'orderNumber', label: 'Order / Bill no.', type: 'text', required: true },
      { id: 'purchaseDate', label: 'Date of purchase', type: 'date', required: true },
      { id: 'amountPaid', label: 'Amount paid (₹)', type: 'number', required: true },
      { id: 'issueDescription', label: 'Issue', type: 'textarea', required: true, rows: 3 },
      { id: 'resolutionRequested', label: 'Resolution wanted', type: 'text', required: true, hint: 'refund / replacement / repair' },
      { id: 'resolutionDays', label: 'Resolution deadline (days)', type: 'number', default: '15' },
    ],
  },

  {
    slug: 'rti-application',
    titleEn: 'RTI Application Letter',
    titleHi: 'सूचना का अधिकार (RTI) आवेदन',
    category: 'misc',
    description: 'Sarkari vibhag se information mangne ke liye RTI letter format.',
    keywords: [
      'RTI application',
      'right to information',
      'sucha ka adhikaar',
      'RTI letter format',
      'सूचना का अधिकार',
    ],
    recipientLines: {
      en: ['To,', 'The Public Information Officer,', '{{publicAuthority}}'],
      hi: ['सेवा में,', 'श्रीमान जन सूचना अधिकारी,', '{{publicAuthority}}'],
    },
    subject: {
      en: 'Application under Section 6 of the Right to Information Act, 2005.',
      hi: 'सूचना का अधिकार अधिनियम, 2005 की धारा 6 के अन्तर्गत आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

Under the Right to Information Act, 2005, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, mobile {{mobile}}, request you to kindly provide me the following information / certified copies:

{{informationSought}}

Period to which the information pertains: {{period}}.

I have deposited the prescribed application fee of Rs. {{rtiFee}} via {{paymentMode}} (proof enclosed). If the requested information is denied in part or in full, kindly cite the specific provisions of the Act invoked. In case any clarification is required, I may be contacted on the above mobile number / address.

I hereby declare that I am a citizen of India and shall use the information sought only for lawful purposes.`,
      hi: `महोदय,

सूचना का अधिकार अधिनियम, 2005 के अन्तर्गत, मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, मोबाइल {{mobile}}, आपसे निम्नलिखित सूचना / प्रमाणित प्रतियाँ उपलब्ध कराने का अनुरोध करता/करती हूँ —

{{informationSought}}

जिस अवधि से सम्बन्धित सूचना अपेक्षित है — {{period}}।

निर्धारित आवेदन शुल्क रुपये {{rtiFee}} {{paymentMode}} के माध्यम से जमा कर दिया गया है (प्रमाण संलग्न)। यदि माँगी गई सूचना का कोई भाग प्रदान नहीं किया जाता है तो कृपया अधिनियम की वह विशेष धारा उद्धृत करने की कृपा करें। किसी स्पष्टीकरण हेतु मुझसे उपर्युक्त मोबाइल नम्बर / पते पर सम्पर्क किया जा सकता है।

मैं घोषणा करता/करती हूँ कि मैं भारत का नागरिक हूँ तथा माँगी गई सूचना का प्रयोग केवल विधिसम्मत उद्देश्य से करूँगा/करूँगी।`,
    },
    fields: [
      { id: 'publicAuthority', label: 'Public authority', type: 'text', required: true, hint: 'e.g. Office of Tehsildar' },
      { id: 'informationSought', label: 'Information sought', type: 'textarea', required: true, rows: 5 },
      { id: 'period', label: 'Time period', type: 'text', required: true, hint: 'जैसे — Jan 2024 to Dec 2024' },
      { id: 'rtiFee', label: 'RTI fee paid (₹)', type: 'number', default: '10' },
      { id: 'paymentMode', label: 'Payment mode', type: 'text', default: 'IPO / DD / cash receipt' },
    ],
  },
];
