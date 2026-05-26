import type { ApplicationTemplate } from './types';

/**
 * Property / Utility application templates — bilingual (English + Hindi).
 * Note: electricity templates moved to templates-electricity.ts.
 */
export const PROPERTY_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'water-connection',
    titleEn: 'New Water Connection Application',
    titleHi: 'नया पानी कनेक्शन हेतु आवेदन',
    category: 'property',
    description: 'Jal Nigam / Nagar Nigam se naya paani connection lene ke liye.',
    keywords: [
      'water connection',
      'naya paani connection',
      'jal nigam connection',
      'pipeline connection',
      'पानी कनेक्शन',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Jal Nigam / Water Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'जल निगम, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for new {{connectionType}} water connection at {{address}}.',
      hi: '{{address}} पर नया {{connectionType}} पानी कनेक्शन हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, beg to state that I require a new {{connectionType}} water connection at the said premises. There is presently no piped water supply at my house, due to which my family is facing severe inconvenience in obtaining clean drinking water.

I am attaching the required documents — proof of ownership / NOC, Aadhaar card, identity proof, two passport-size photographs, and the prescribed application form / fee receipt. I shall abide by all the rules of the department and pay all water bills regularly.

I, therefore, request you to kindly survey my premises and sanction the new water connection at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, उक्त स्थान पर नया {{connectionType}} पानी कनेक्शन प्राप्त करना चाहता/चाहती हूँ। वर्तमान में मेरे घर पर पाइप द्वारा पानी की आपूर्ति नहीं है, जिसके कारण परिवार को स्वच्छ पेयजल प्राप्त करने में अत्यन्त कठिनाई हो रही है।

आवश्यक दस्तावेज़ — स्वामित्व प्रमाण / NOC, आधार कार्ड, पहचान पत्र, दो पासपोर्ट साइज़ फोटो एवं निर्धारित आवेदन प्रपत्र / शुल्क रसीद — संलग्न हैं। मैं विभाग के समस्त नियमों का पालन करूँगा/करूँगी तथा पानी का बिल समय पर जमा करूँगा/करूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया मेरे आवास का सर्वे करवाकर शीघ्र नया पानी कनेक्शन स्वीकृत करने की कृपा करें।`,
    },
    fields: [
      { id: 'connectionType', label: 'Connection type', type: 'text', default: 'Domestic', hint: 'Domestic / Commercial' },
    ],
  },

  {
    slug: 'lpg-transfer',
    titleEn: 'LPG Gas Connection Transfer',
    titleHi: 'LPG गैस कनेक्शन स्थानांतरण आवेदन',
    category: 'property',
    description: 'LPG connection ko doosre distributor / sheher transfer karwana.',
    keywords: [
      'LPG transfer',
      'gas connection transfer',
      'Indane transfer',
      'HP gas transfer',
      'Bharat gas transfer',
      'गैस कनेक्शन',
    ],
    recipientLines: {
      en: ['To,', 'The Manager,', '{{gasAgency}} LPG Distributorship, {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान प्रबन्धक महोदय,', '{{gasAgency}} गैस एजेंसी, {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for transfer of LPG connection (Consumer No. {{consumerNumber}}).',
      hi: 'LPG कनेक्शन (उपभोक्ता संख्या {{consumerNumber}}) स्थानांतरण हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of LPG connection bearing Consumer No. {{consumerNumber}} under {{gasAgency}}, beg to state that I have shifted my residence to {{newAddress}} due to {{transferReason}}.

Since my new residence falls outside the service area of my present distributor, I request you to kindly transfer my LPG connection to {{newAgency}} distributorship for uninterrupted service. The required Subscription Voucher / TV (Termination Voucher) and the relevant documents are enclosed.

Kindly process the transfer at the earliest. I shall remain grateful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{gasAgency}} के अन्तर्गत उपभोक्ता संख्या {{consumerNumber}} वाले LPG कनेक्शन का/की धारक हूँ। {{transferReason}} के कारण मैंने अपना निवास {{newAddress}} पर स्थानांतरित कर लिया है।

मेरा नया निवास वर्तमान वितरक के सेवा क्षेत्र में नहीं आता, अतः कृपया मेरे LPG कनेक्शन को निरन्तर सेवा हेतु {{newAgency}} एजेंसी पर स्थानांतरित करने की कृपा करें। आवश्यक Subscription Voucher / TV (Termination Voucher) तथा सम्बन्धित दस्तावेज़ संलग्न हैं।

कृपया स्थानांतरण की प्रक्रिया शीघ्र पूर्ण करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'gasAgency', label: 'Current agency', type: 'text', required: true, hint: 'Indane / HP / Bharat' },
      { id: 'consumerNumber', label: 'Consumer number', type: 'text', required: true },
      { id: 'newAddress', label: 'New address', type: 'textarea', required: true, rows: 2 },
      { id: 'newAgency', label: 'New distributor / city', type: 'text', required: true },
      { id: 'transferReason', label: 'Reason', type: 'text', required: true, hint: 'job transfer / family shifted' },
    ],
  },

  {
    slug: 'rent-receipt',
    titleEn: 'Rent Receipt Letter (HRA Claim)',
    titleHi: 'किराये की रसीद (HRA दावा हेतु)',
    category: 'property',
    description: 'Office / employer ko HRA claim ke liye rent receipt format.',
    keywords: [
      'rent receipt',
      'HRA claim',
      'rent receipt letter',
      'landlord rent receipt',
      'किराये की रसीद',
    ],
    recipientLines: {
      en: ['To,', 'The HR / Finance Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. / वित्त प्रबन्धक,', '{{companyName}}'],
    },
    subject: {
      en: 'Submission of rent receipts for HRA claim — F.Y. {{financialYear}}.',
      hi: 'HRA दावा हेतु किराये की रसीदें प्रस्तुत करना — वित्तीय वर्ष {{financialYear}}।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), beg to submit the following rent particulars for claim of HRA / income-tax exemption for the financial year {{financialYear}}:

• Tenant: {{fullName}}
• Landlord: {{landlordName}}
• Landlord's PAN: {{landlordPan}}
• Rented address: {{rentedAddress}}
• Rent period: from {{rentFrom}} to {{rentTo}}
• Monthly rent: Rs. {{monthlyRent}}
• Total rent paid: Rs. {{totalRent}}

A signed rent receipt issued by the landlord and copy of the rent agreement are enclosed herewith. Kindly take the same on record for HRA computation.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}), वित्तीय वर्ष {{financialYear}} हेतु HRA / आयकर छूट दावे के लिए किराये का विवरण प्रस्तुत कर रहा/रही हूँ —

• किरायेदार — {{fullName}}
• मकान मालिक — {{landlordName}}
• मकान मालिक का PAN — {{landlordPan}}
• किराये का पता — {{rentedAddress}}
• किराये की अवधि — {{rentFrom}} से {{rentTo}} तक
• मासिक किराया — रुपये {{monthlyRent}}
• कुल किराया जमा — रुपये {{totalRent}}

मकान मालिक द्वारा हस्ताक्षरित किराये की रसीद एवं किरायानामे की प्रति इस आवेदन के साथ संलग्न है। कृपया उक्त को HRA गणना हेतु अभिलेख में लेने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'financialYear', label: 'Financial year', type: 'text', required: true, default: '2025-26' },
      { id: 'landlordName', label: 'Landlord name', type: 'text', required: true },
      { id: 'landlordPan', label: 'Landlord PAN', type: 'text' },
      { id: 'rentedAddress', label: 'Rented address', type: 'textarea', required: true, rows: 2 },
      { id: 'rentFrom', label: 'Rent from', type: 'date', required: true },
      { id: 'rentTo', label: 'Rent to', type: 'date', required: true },
      { id: 'monthlyRent', label: 'Monthly rent (₹)', type: 'number', required: true },
      { id: 'totalRent', label: 'Total rent paid (₹)', type: 'number', required: true },
    ],
  },

  {
    slug: 'society-noc',
    titleEn: 'Society NOC for Renovation / Pet / Rental',
    titleHi: 'सोसायटी NOC आवेदन',
    category: 'property',
    description: 'Apartment / society se renovation, pet, rent ke liye NOC.',
    keywords: [
      'society NOC',
      'flat renovation NOC',
      'pet permission society',
      'apartment NOC',
      'सोसायटी NOC',
    ],
    recipientLines: {
      en: ['To,', 'The Secretary / Managing Committee,', '{{societyName}}, {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान सचिव / प्रबन्ध समिति,', '{{societyName}}, {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for NOC regarding {{noccPurpose}}.',
      hi: '{{noccPurpose}} हेतु सोसायटी NOC के लिए आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, owner / resident of Flat No. {{flatNumber}} in {{societyName}}, beg to apply for a No-Objection Certificate from the Managing Committee with respect to {{noccPurpose}}.

Brief details: {{noccDetails}}

I assure you that all activities undertaken shall be in strict compliance with the society's bye-laws, common areas shall not be inconvenienced and any cleaning / repair charges shall be borne by me. Kindly issue the NOC at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{societyName}} में फ्लैट संख्या {{flatNumber}} का/की स्वामी / निवासी हूँ। {{noccPurpose}} हेतु मुझे प्रबन्ध समिति की ओर से अनापत्ति प्रमाण पत्र (NOC) की आवश्यकता है।

संक्षिप्त विवरण — {{noccDetails}}

मैं आश्वस्त करता/करती हूँ कि समस्त कार्य सोसायटी के नियमों के अनुरूप होंगे, सार्वजनिक क्षेत्रों को कोई असुविधा नहीं होगी एवं किसी भी प्रकार के सफाई / मरम्मत व्यय का वहन मैं स्वयं करूँगा/करूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया NOC शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'societyName', label: 'Society name', type: 'text', required: true },
      { id: 'flatNumber', label: 'Flat / unit number', type: 'text', required: true },
      { id: 'noccPurpose', label: 'NOC purpose', type: 'text', required: true, hint: 'renovation / pet / rent out / parking' },
      { id: 'noccDetails', label: 'Details', type: 'textarea', rows: 3 },
    ],
  },
];
