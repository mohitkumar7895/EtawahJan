import type { ApplicationTemplate } from './types';

/**
 * Sarkari (Tehsil / SDM / Police / Municipal) application templates.
 * Bilingual — professional English + pure Hindi (Devanagari).
 */
export const SARKARI_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'income-certificate',
    titleEn: 'Income Certificate Application',
    titleHi: 'आय प्रमाण पत्र हेतु आवेदन',
    category: 'sarkari',
    description: 'Tehsil mein aay praman patra (income certificate) banwane ke liye.',
    keywords: [
      'income certificate',
      'aay praman patra',
      'tehsil application',
      'sarkari naukri ke liye',
      'scholarship ke liye income',
      'EWS aay praman',
      'आय प्रमाण पत्र',
    ],
    recipientLines: {
      en: [
        'To,',
        'The Tehsildar,',
        'Tehsil {{tehsil}}, District {{district}} ({{state}})',
      ],
      hi: [
        'सेवा में,',
        'श्रीमान तहसीलदार महोदय,',
        'तहसील {{tehsil}}, जनपद {{district}} ({{state}})',
      ],
    },
    subject: {
      en: 'Application for issuance of Income Certificate.',
      hi: 'आय प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, village {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, would like to apply for an Income Certificate in my favour.

I require this certificate for the purpose of {{purpose}}. The total annual income of my family is approximately Rs. {{annualIncome}} ({{annualIncomeWords}} only) and our family consists of {{familyMembers}} members. All supporting documents are attached herewith.

I, therefore, request you to kindly verify my application and issue the Income Certificate at the earliest. I shall remain grateful for your kind co-operation.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, ग्राम {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}} का स्थायी निवासी हूँ।

मुझे {{purpose}} हेतु आय प्रमाण पत्र की आवश्यकता है। मेरे परिवार की कुल वार्षिक आय लगभग रुपये {{annualIncome}} (रुपये {{annualIncomeWords}} मात्र) है तथा परिवार में कुल {{familyMembers}} सदस्य हैं। समस्त सम्बन्धित दस्तावेज़ संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया जाँचोपरान्त शीघ्र आय प्रमाण पत्र निर्गत करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'purpose', label: 'Purpose / Reason', type: 'text', required: true, hint: 'जैसे — scholarship, सरकारी नौकरी, college admission' },
      { id: 'annualIncome', label: 'Annual family income (₹)', type: 'number', required: true },
      { id: 'annualIncomeWords', label: 'Income in words', type: 'text', hint: 'जैसे — Fifty Thousand / पचास हज़ार' },
      { id: 'familyMembers', label: 'Number of family members', type: 'number', default: '4' },
    ],
  },

  {
    slug: 'caste-certificate',
    titleEn: 'Caste Certificate Application',
    titleHi: 'जाति प्रमाण पत्र हेतु आवेदन',
    category: 'sarkari',
    description: 'SC / ST / OBC jaati praman patra banwane hetu Tehsil aavedan.',
    keywords: [
      'caste certificate',
      'jaati praman patra',
      'SC certificate',
      'ST certificate',
      'OBC certificate',
      'reservation certificate',
      'जाति प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Tehsildar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान तहसीलदार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of Caste Certificate.',
      hi: 'जाति प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, village {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, am a permanent resident of this place. My caste is {{caste}} which falls under the {{casteCategory}} category as per the official list.

I require a Caste Certificate for the purpose of {{purpose}}. My father / forefathers are also natives of the same village and all relevant documents (Khatauni, family register, identity proofs) are attached herewith.

I, therefore, request you to kindly verify the application and issue my Caste Certificate at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, ग्राम {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}} का स्थायी निवासी हूँ। मेरी जाति {{caste}} है जो शासन की सूची के अनुसार {{casteCategory}} श्रेणी में आती है।

मुझे {{purpose}} हेतु जाति प्रमाण पत्र की आवश्यकता है। मेरे पिता/पूर्वज भी इसी ग्राम के मूल निवासी हैं तथा हमारी जाति से सम्बन्धित समस्त अभिलेख (खतौनी, परिवार रजिस्टर, पहचान पत्र) इस आवेदन के साथ संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया जाँच करवाकर शीघ्र मेरा जाति प्रमाण पत्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'caste', label: 'Caste name', type: 'text', required: true },
      { id: 'casteCategory', label: 'Category', type: 'text', default: 'OBC', hint: 'SC / ST / OBC / EWS / General' },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true },
    ],
  },

  {
    slug: 'domicile-certificate',
    titleEn: 'Domicile (Residence) Certificate Application',
    titleHi: 'निवास / मूल निवास प्रमाण पत्र आवेदन',
    category: 'sarkari',
    description: 'Mool nivas / domicile certificate ke liye Tehsildar ko aavedan.',
    keywords: [
      'domicile certificate',
      'nivas praman patra',
      'mool nivas certificate',
      'residence certificate',
      'state domicile',
      'मूल निवास प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Tehsildar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान तहसीलदार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of Domicile / Residence Certificate.',
      hi: 'मूल निवास / निवास प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, am a permanent resident of village {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, state {{state}}. I have been residing at this address continuously for the past {{yearsOfResidence}} years.

I require a Domicile / Residence Certificate for the purpose of {{purpose}}. As proof of my long-term residence, I am attaching all relevant documents — Aadhaar Card, Voter ID, Khatauni, family register and bills of utility services.

I, therefore, request you to kindly issue my Residence Certificate at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, ग्राम {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}}, राज्य {{state}} का स्थायी निवासी हूँ। मैं विगत {{yearsOfResidence}} वर्षों से लगातार इसी पते पर निवास कर रहा हूँ।

मुझे {{purpose}} हेतु मूल निवास प्रमाण पत्र की आवश्यकता है। प्रमाण के रूप में आधार कार्ड, मतदाता पहचान पत्र, खतौनी, परिवार रजिस्टर एवं बिजली/पानी के बिल इस आवेदन के साथ संलग्न किए जा रहे हैं।

अतः आपसे विनम्र अनुरोध है कि कृपया मेरा निवास प्रमाण पत्र शीघ्र जारी करने की कृपा करें।`,
    },
    fields: [
      { id: 'yearsOfResidence', label: 'Years of residence', type: 'number', required: true, default: '15' },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'जैसे — MBBS admission, central job' },
    ],
  },

  {
    slug: 'ews-certificate',
    titleEn: 'EWS (Economically Weaker Section) Certificate',
    titleHi: 'EWS (आर्थिक कमज़ोर वर्ग) प्रमाण पत्र',
    category: 'sarkari',
    description: '10% reservation ke liye EWS praman patra banwane ka aavedan.',
    keywords: [
      'EWS certificate',
      'arthik kamzor varg',
      '10 percent reservation',
      'general category EWS',
      'income asset certificate',
      'आर्थिक कमज़ोर वर्ग',
    ],
    recipientLines: {
      en: ['To,', 'The Tehsildar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान तहसीलदार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of EWS Certificate.',
      hi: 'EWS प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, belong to the General category. The total annual income of my family is approximately Rs. {{annualIncome}}, which is below the prescribed limit of Rs. 8,00,000.

I do not own any of the following assets:
• 5 acres or more of agricultural land,
• A residential flat of 1000 sq.ft. or more,
• A residential plot of 100 sq.yd. or more in a notified municipality.

Therefore, I am eligible for benefits under the EWS reservation scheme. I require this certificate for {{purpose}}. Kindly verify and issue the EWS Certificate at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, सामान्य (General) श्रेणी का/की हूँ। मेरे परिवार की कुल वार्षिक आय लगभग रुपये {{annualIncome}} है, जो शासन द्वारा निर्धारित रुपये 8,00,000 की सीमा से कम है।

मेरे पास निम्नलिखित में से कोई भी सम्पत्ति नहीं है —
• 5 एकड़ या उससे अधिक की कृषि भूमि,
• 1000 वर्ग फुट या उससे बड़ा आवासीय फ्लैट,
• किसी अधिसूचित नगरपालिका में 100 वर्ग गज या उससे बड़ा आवासीय भूखण्ड।

अतः मैं EWS आरक्षण का पात्र हूँ। मुझे यह प्रमाण पत्र {{purpose}} हेतु चाहिए। कृपया जाँचोपरान्त शीघ्र EWS प्रमाण पत्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'annualIncome', label: 'Annual family income (₹)', type: 'number', required: true },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'UPSC, PCS, central naukri admit card' },
    ],
  },

  {
    slug: 'birth-certificate',
    titleEn: 'Birth Certificate Application',
    titleHi: 'जन्म प्रमाण पत्र हेतु आवेदन',
    category: 'sarkari',
    description: 'Nagar Nigam / Gram Panchayat se janma praman patra ke liye.',
    keywords: [
      'birth certificate',
      'janma praman patra',
      'nagar nigam birth',
      'gram panchayat birth certificate',
      'baby birth certificate',
      'जन्म प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Chief Officer,', 'Nagar Nigam / Gram Panchayat {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान मुख्य अधिकारी महोदय,', 'नगर निगम / ग्राम पंचायत {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of Birth Certificate.',
      hi: 'जन्म प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, beg to state that my son/daughter, namely {{childName}}, was born on {{birthDate}} at {{birthPlace}}. The hospital / midwife records confirming the birth are enclosed herewith.

The particulars are as follows:
• Father's name: {{fatherName}}
• Mother's name: {{motherName}}
• Permanent address: {{address}}, {{village}}, post {{post}}

I, therefore, request you to kindly issue the Birth Certificate of my child at the earliest. I shall remain grateful for your kind co-operation.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, मेरे पुत्र/पुत्री का नाम {{childName}} है, जिनका जन्म दिनांक {{birthDate}} को {{birthPlace}} पर हुआ था। जन्म से सम्बन्धित अस्पताल/दाई के अभिलेख इस आवेदन के साथ संलग्न हैं।

विवरण इस प्रकार है —
• पिता का नाम — {{fatherName}}
• माता का नाम — {{motherName}}
• स्थायी पता — {{address}}, {{village}}, पोस्ट {{post}}

अतः आपसे विनम्र निवेदन है कि कृपया मेरे बच्चे का जन्म प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'childName', label: "Child's name", type: 'text', required: true },
      { id: 'birthDate', label: 'Date of birth', type: 'date', required: true },
      { id: 'birthPlace', label: 'Place of birth', type: 'text', required: true, hint: 'अस्पताल का नाम / गाँव' },
    ],
  },

  {
    slug: 'death-certificate',
    titleEn: 'Death Certificate Application',
    titleHi: 'मृत्यु प्रमाण पत्र आवेदन',
    category: 'sarkari',
    description: 'Mrityu praman patra ke liye Nagar Nigam / Panchayat aavedan.',
    keywords: [
      'death certificate',
      'mrityu praman patra',
      'panchayat death certificate',
      'family member death',
      'मृत्यु प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Chief Officer,', 'Nagar Nigam / Gram Panchayat {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान मुख्य अधिकारी महोदय,', 'नगर निगम / ग्राम पंचायत {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of Death Certificate.',
      hi: 'मृत्यु प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With great sorrow I beg to inform that my {{relation}}, late Shri / Smt. {{deceasedName}}, expired on {{deathDate}} at {{deathPlace}}. The relevant medical / panchayat records confirming the death are enclosed.

I require a Death Certificate for the purpose of {{purpose}}. Without this certificate, the further legal and financial formalities cannot proceed.

I, therefore, request you to kindly issue the Death Certificate at the earliest.`,
      hi: `महोदय,

अत्यन्त शोक के साथ सूचित करना है कि मेरे {{relation}} स्वर्गीय श्री/श्रीमती {{deceasedName}} का देहावसान दिनांक {{deathDate}} को {{deathPlace}} पर हो गया था। मृत्यु से सम्बन्धित चिकित्सकीय/पंचायत अभिलेख इस आवेदन के साथ संलग्न हैं।

मुझे {{purpose}} हेतु मृत्यु प्रमाण पत्र की आवश्यकता है। बिना इस प्रमाण पत्र के आगे की कानूनी एवं वित्तीय कार्रवाई सम्भव नहीं है।

अतः आपसे विनम्र निवेदन है कि कृपया शीघ्र मृत्यु प्रमाण पत्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'deceasedName', label: 'Deceased name', type: 'text', required: true },
      { id: 'relation', label: 'Your relation', type: 'text', required: true, hint: 'पिता / माता / पति / भाई' },
      { id: 'deathDate', label: 'Date of death', type: 'date', required: true },
      { id: 'deathPlace', label: 'Place of death', type: 'text', required: true },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'insurance, property transfer' },
    ],
  },

  {
    slug: 'aadhaar-correction',
    titleEn: 'Aadhaar Card Correction Request',
    titleHi: 'आधार कार्ड सुधार हेतु आवेदन',
    category: 'sarkari',
    description: 'Aadhaar mein naam / pata / DOB sudhar ke liye UIDAI aavedan.',
    keywords: [
      'aadhaar correction',
      'aadhaar update',
      'aadhaar mein naam sudhar',
      'aadhaar address change',
      'aadhaar dob correction',
      'आधार सुधार',
    ],
    recipientLines: {
      en: ['To,', 'The In-charge,', 'Aadhaar Enrolment Centre, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान आधार नामांकन केन्द्र प्रभारी,', '{{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for correction of {{correctionField}} in Aadhaar Card.',
      hi: 'आधार कार्ड में {{correctionField}} सुधार हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of Aadhaar number ending with {{aadhaarLast4}}, beg to state that the {{correctionField}} on my Aadhaar Card has been recorded incorrectly.

The correct particulars are as follows:
• Currently recorded (incorrect): {{wrongValue}}
• Correct: {{correctValue}}

In support of the correct information, I am attaching {{proofDocument}} as proof.

I, therefore, request you to kindly carry out the said correction in my Aadhaar record at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मेरे आधार कार्ड (अंतिम 4 अंक — {{aadhaarLast4}}) में {{correctionField}} ग़लत दर्ज हुआ है।

सही विवरण इस प्रकार है —
• वर्तमान में दर्ज (ग़लत) — {{wrongValue}}
• सही विवरण — {{correctValue}}

सही जानकारी के समर्थन में {{proofDocument}} की प्रति संलग्न है।

अतः आपसे विनम्र निवेदन है कि कृपया मेरे आधार रिकॉर्ड में उपरोक्त सुधार शीघ्र करने की कृपा करें।`,
    },
    fields: [
      { id: 'correctionField', label: 'What to correct?', type: 'text', required: true, hint: 'name / father / DOB / address / mobile' },
      { id: 'wrongValue', label: 'Wrong value (currently)', type: 'text', required: true },
      { id: 'correctValue', label: 'Correct value', type: 'text', required: true },
      { id: 'proofDocument', label: 'Proof document', type: 'text', required: true, hint: 'Voter ID / PAN / 10th marksheet' },
    ],
  },

  {
    slug: 'ration-card-new',
    titleEn: 'New Ration Card Application',
    titleHi: 'नया राशन कार्ड आवेदन',
    category: 'sarkari',
    description: 'Naya ration card banwane hetu Khadya Aapurti Vibhag aavedan.',
    keywords: [
      'ration card new',
      'naya ration card',
      'khadya rashan card',
      'BPL ration card',
      'APL ration card',
      'राशन कार्ड',
    ],
    recipientLines: {
      en: ['To,', 'The Food and Supply Officer (Tehsil),', '{{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान खाद्य एवं आपूर्ति अधिकारी (तहसील),', '{{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of new {{cardType}} Ration Card.',
      hi: 'नया {{cardType}} राशन कार्ड निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son of Shri {{fatherName}}, resident of {{address}}, {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, beg to state that my family does not currently possess any ration card. Our annual family income is approximately Rs. {{annualIncome}}.

My family consists of {{familyCount}} members (full list enclosed). Kindly examine our eligibility under the {{cardType}} category and issue a new ration card so that we may avail the benefits of the Public Distribution System.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र श्री {{fatherName}}, निवासी {{address}}, {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}} का स्थायी निवासी हूँ। हमारे परिवार के पास अभी तक कोई भी राशन कार्ड नहीं है तथा हमारी वार्षिक आय लगभग रुपये {{annualIncome}} है।

हमारे परिवार में कुल {{familyCount}} सदस्य हैं (पूर्ण सूची संलग्न)। कृपया हमारी पात्रता की जाँच करके {{cardType}} श्रेणी का राशन कार्ड निर्गत करने की कृपा करें ताकि हम सार्वजनिक वितरण प्रणाली का लाभ ले सकें।`,
    },
    fields: [
      { id: 'cardType', label: 'Card category', type: 'text', default: 'BPL', hint: 'BPL / APL / Antyodaya' },
      { id: 'familyCount', label: 'Family members', type: 'number', required: true, default: '4' },
      { id: 'annualIncome', label: 'Annual income (₹)', type: 'number', required: true },
    ],
  },

  {
    slug: 'voter-id-correction',
    titleEn: 'Voter ID Correction Application',
    titleHi: 'मतदाता पहचान पत्र सुधार आवेदन',
    category: 'sarkari',
    description: 'Voter ID card mein naam / pita / address sudhar ke liye BLO ko aavedan.',
    keywords: [
      'voter id correction',
      'matdata pahchan patra sudhar',
      'EPIC card update',
      'BLO application',
      'मतदाता सुधार',
    ],
    recipientLines: {
      en: ['To,', 'The Booth Level Officer (BLO),', 'Polling Booth, {{village}}, Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान बूथ लेवल अधिकारी (BLO),', 'मतदान केन्द्र, {{village}}, तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for correction in Voter ID Card.',
      hi: 'मतदाता पहचान पत्र में सुधार हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of Voter ID (EPIC) number {{epicNumber}}, beg to state that the {{correctionField}} on my Voter ID has been recorded incorrectly as "{{wrongValue}}" whereas the correct value is "{{correctValue}}".

In support of the correct information, I am attaching a self-attested copy of {{proofDocument}}. Kindly verify and update my Voter ID record. I shall remain grateful.`,
      hi: `महोदय,

सविनय निवेदन है कि मेरे मतदाता पहचान पत्र (EPIC संख्या — {{epicNumber}}) में {{correctionField}} ग़लत रूप से "{{wrongValue}}" दर्ज है, जबकि सही विवरण "{{correctValue}}" है।

प्रमाण के रूप में {{proofDocument}} की स्व-प्रमाणित प्रति संलग्न है। कृपया जाँच करवाकर मेरे मतदाता रिकॉर्ड में सुधार करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'epicNumber', label: 'EPIC / Voter ID number', type: 'text', required: true },
      { id: 'correctionField', label: 'Field to correct', type: 'text', required: true, hint: 'name / age / address / father' },
      { id: 'wrongValue', label: 'Wrong value', type: 'text', required: true },
      { id: 'correctValue', label: 'Correct value', type: 'text', required: true },
      { id: 'proofDocument', label: 'Proof attached', type: 'text', required: true, hint: 'Aadhaar / 10th marksheet' },
    ],
  },

  {
    slug: 'fir-complaint',
    titleEn: 'FIR / Police Complaint Letter',
    titleHi: 'पुलिस शिकायत / FIR हेतु प्रार्थना पत्र',
    category: 'sarkari',
    description: 'Thana incharge ko likhi gayi FIR / police complaint application.',
    keywords: [
      'FIR application',
      'police complaint',
      'thana incharge ko aavedan',
      'shikayat patra',
      'NCR complaint',
      'पुलिस शिकायत',
    ],
    recipientLines: {
      en: ['To,', 'The Station House Officer (SHO),', 'Police Station {{policeStation}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान थाना प्रभारी महोदय,', 'थाना {{policeStation}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Complaint regarding {{incidentType}} — request for registration of FIR / NCR.',
      hi: '{{incidentType}} के सम्बन्ध में शिकायत — FIR / NCR दर्ज करने हेतु प्रार्थना पत्र।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, mobile {{mobile}}, beg to state that on {{incidentDate}} at approximately {{incidentTime}}, the following incident took place at {{incidentPlace}}.

Brief facts of the incident:
{{incidentDescription}}

Despite my best efforts I have been unable to resolve the matter informally and I now wish to bring the matter on official record. I, therefore, request you to kindly register an FIR / NCR on the basis of this complaint, conduct the necessary investigation and take strict legal action against the person(s) responsible.

I shall fully co-operate with the investigation. I shall remain grateful for your kind assistance.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, मोबाइल {{mobile}}, यह सूचित करना चाहता/चाहती हूँ कि दिनांक {{incidentDate}} को लगभग {{incidentTime}} बजे {{incidentPlace}} पर निम्नलिखित घटना घटित हुई।

संक्षेप में घटना का विवरण —
{{incidentDescription}}

मैंने यथासम्भव मामले को आपस में सुलझाने का प्रयास किया परन्तु सफलता नहीं मिली, अतः अब मैं इसे आधिकारिक अभिलेख पर लाना चाहता/चाहती हूँ।

अतः आपसे विनम्र निवेदन है कि उपर्युक्त शिकायत के आधार पर FIR / NCR दर्ज करवाकर निष्पक्ष विवेचना करवाने तथा दोषी व्यक्तियों के विरुद्ध कठोरतम विधिक कार्रवाई करने की कृपा करें। मैं विवेचना में पूर्ण सहयोग दूँगा/दूँगी।`,
    },
    fields: [
      { id: 'incidentType', label: 'Type of incident', type: 'text', required: true, hint: 'theft / fraud / harassment / accident' },
      { id: 'policeStation', label: 'Police station name', type: 'text', required: true },
      { id: 'incidentDate', label: 'Date of incident', type: 'date', required: true },
      { id: 'incidentTime', label: 'Time (approx)', type: 'text', default: '8:00 PM' },
      { id: 'incidentPlace', label: 'Place of incident', type: 'text', required: true },
      { id: 'incidentDescription', label: 'Detailed description', type: 'textarea', required: true, rows: 5 },
    ],
  },

  {
    slug: 'property-mutation',
    titleEn: 'Property Mutation (Dakhil Kharij)',
    titleHi: 'नामान्तरण (दाखिल खारिज) हेतु आवेदन',
    category: 'sarkari',
    description: 'Khatauni mein nameater karne (mutation) ke liye Tehsil aavedan.',
    keywords: [
      'property mutation',
      'dakhil kharij',
      'khatauni naam transfer',
      'land mutation',
      'wirasat namantaran',
      'दाखिल खारिज',
    ],
    recipientLines: {
      en: ['To,', 'The Tehsildar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान तहसीलदार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for mutation (Dakhil Kharij) of Khasra No. {{khasraNumber}} in Khatauni.',
      hi: 'खसरा संख्या {{khasraNumber}} के नामान्तरण (दाखिल खारिज) हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, beg to state that the agricultural / residential land bearing Khasra No. {{khasraNumber}}, area {{landArea}}, situated in village {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, has been transferred in my name by way of {{transferMode}} dated {{transferDate}}.

The previous owner of the said land was Shri/Smt. {{previousOwner}}. Copies of the registered sale deed / will / inheritance documents along with the latest Khatauni and identity proofs are enclosed for your kind perusal.

I, therefore, request you to kindly initiate the mutation (Dakhil Kharij) proceedings and update the revenue record by entering my name as the new owner.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}} का स्थायी निवासी हूँ। ग्राम {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}} स्थित खसरा संख्या {{khasraNumber}}, रकबा {{landArea}} की कृषि/आवासीय भूमि दिनांक {{transferDate}} को {{transferMode}} के माध्यम से मेरे नाम हस्तान्तरित हो चुकी है।

उक्त भूमि के पूर्व स्वामी श्री/श्रीमती {{previousOwner}} थे। पंजीकृत विक्रय पत्र / वसीयत / वारिसान दस्तावेज़, नवीनतम खतौनी एवं पहचान पत्रों की प्रतियाँ संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त भूमि की दाखिल खारिज की कार्रवाई शीघ्र पूर्ण करते हुए राजस्व अभिलेख में मेरा नाम स्वामी के रूप में दर्ज करने की कृपा करें।`,
    },
    fields: [
      { id: 'khasraNumber', label: 'Khasra number', type: 'text', required: true },
      { id: 'landArea', label: 'Area of land', type: 'text', required: true, hint: 'जैसे — 0.250 हेक्टेयर' },
      { id: 'previousOwner', label: 'Previous owner name', type: 'text', required: true },
      { id: 'transferMode', label: 'Mode of transfer', type: 'text', default: 'sale deed', hint: 'sale / inheritance / will / gift' },
      { id: 'transferDate', label: 'Date of transfer', type: 'date', required: true },
    ],
  },

  {
    slug: 'pension-application',
    titleEn: 'Old-Age / Widow Pension Application',
    titleHi: 'वृद्धावस्था / विधवा पेंशन आवेदन',
    category: 'sarkari',
    description: 'Vridhavastha / vidhwa / divyang pension yojna ka aavedan.',
    keywords: [
      'old age pension',
      'widow pension',
      'vridha pension',
      'vidhwa pension',
      'divyang pension',
      'samaj kalyan pension',
      'पेंशन योजना',
    ],
    recipientLines: {
      en: ['To,', 'The District Social Welfare Officer,', 'District {{district}}, {{state}}'],
      hi: ['सेवा में,', 'श्रीमान जिला समाज कल्याण अधिकारी,', 'जनपद {{district}}, {{state}}'],
    },
    subject: {
      en: 'Application for {{pensionType}} Pension under State scheme.',
      hi: '{{pensionType}} पेंशन योजना अन्तर्गत आर्थिक सहायता हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter/widow of Shri {{fatherName}}, aged {{applicantAge}} years, resident of {{address}}, beg to state that I am eligible for the {{pensionType}} Pension scheme run by the Government.

I have no regular source of income and the total annual income of my family is approximately Rs. {{annualIncome}}. I do not draw any other Government pension at present. All required documents — Aadhaar, age / death / disability proof, bank passbook copy and family register — are attached.

I, therefore, request you to kindly sanction the {{pensionType}} Pension in my favour so that I may live with dignity. I shall remain grateful for your kind assistance.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री/विधवा श्री {{fatherName}}, आयु {{applicantAge}} वर्ष, निवासी {{address}}, शासन द्वारा संचालित {{pensionType}} पेंशन योजना का पात्र/पात्रा हूँ।

मेरे पास आय का कोई नियमित साधन नहीं है तथा परिवार की कुल वार्षिक आय लगभग रुपये {{annualIncome}} है। वर्तमान में मैं किसी अन्य सरकारी पेंशन का लाभ नहीं ले रहा/रही हूँ। आधार, आयु/मृत्यु/दिव्यांगता प्रमाण पत्र, बैंक पासबुक प्रति एवं परिवार रजिस्टर इस आवेदन के साथ संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया मेरे पक्ष में {{pensionType}} पेंशन शीघ्र स्वीकृत करने की कृपा करें ताकि मैं सम्मानजनक जीवन व्यतीत कर सकूँ। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'pensionType', label: 'Pension type', type: 'text', required: true, hint: 'Old-age / Widow / Divyang' },
      { id: 'applicantAge', label: 'Your age', type: 'number', required: true, default: '65' },
      { id: 'annualIncome', label: 'Annual income (₹)', type: 'number', required: true, default: '20000' },
    ],
  },

  {
    slug: 'marriage-registration',
    titleEn: 'Marriage Registration Application',
    titleHi: 'विवाह पंजीकरण हेतु आवेदन',
    category: 'sarkari',
    description: 'Court / Tehsil mein vivah pranjikaran karwane ka aavedan.',
    keywords: [
      'marriage registration',
      'vivah panjikaran',
      'marriage certificate',
      'shadi praman patra',
      'विवाह प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Marriage Registrar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान विवाह रजिस्ट्रार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for registration of marriage and issuance of Marriage Certificate.',
      hi: 'विवाह पंजीकरण एवं विवाह प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, we, {{fullName}} (husband) and {{spouseName}} (wife), beg to state that our marriage was solemnised on {{marriageDate}} at {{marriagePlace}} as per Hindu / Muslim / Christian / Special Marriage Act rites.

Brief particulars are as follows:
• Husband: {{fullName}} S/o {{fatherName}}, aged {{husbandAge}} years
• Wife: {{spouseName}}, aged {{wifeAge}} years
• Place & Date of marriage: {{marriagePlace}}, {{marriageDate}}
• Witnesses: {{witnessOne}} and {{witnessTwo}}

All required affidavits, photographs of the marriage ceremony, identity / age proofs of both parties and witness IDs are enclosed. We, therefore, request you to kindly register our marriage and issue the Marriage Certificate at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि हम, {{fullName}} (पति) एवं {{spouseName}} (पत्नी), यह सूचित करते हैं कि हमारा विवाह दिनांक {{marriageDate}} को {{marriagePlace}} पर हिन्दू / मुस्लिम / ईसाई / विशेष विवाह अधिनियम के अनुसार सम्पन्न हुआ।

विवरण इस प्रकार है —
• पति — {{fullName}}, पुत्र श्री {{fatherName}}, आयु {{husbandAge}} वर्ष
• पत्नी — {{spouseName}}, आयु {{wifeAge}} वर्ष
• विवाह का स्थान एवं दिनांक — {{marriagePlace}}, {{marriageDate}}
• साक्षी — {{witnessOne}} एवं {{witnessTwo}}

अपेक्षित शपथ पत्र, विवाह समारोह के फोटोग्राफ़, दोनों पक्षों के पहचान/आयु प्रमाण एवं साक्षियों के पहचान पत्र इस आवेदन के साथ संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया हमारे विवाह का पंजीकरण कर शीघ्र विवाह प्रमाण पत्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'marriageDate', label: 'Date of marriage', type: 'date', required: true },
      { id: 'marriagePlace', label: 'Place of marriage', type: 'text', required: true },
      { id: 'husbandAge', label: "Husband's age", type: 'number', required: true },
      { id: 'wifeAge', label: "Wife's age", type: 'number', required: true },
      { id: 'witnessOne', label: 'Witness 1 name', type: 'text', required: true },
      { id: 'witnessTwo', label: 'Witness 2 name', type: 'text', required: true },
    ],
  },

  {
    slug: 'khatauni-copy',
    titleEn: 'Khatauni / Land Record Copy Application',
    titleHi: 'खतौनी / भूलेख प्रति हेतु आवेदन',
    category: 'sarkari',
    description: 'Updated khatauni / khasra ki nakal Tehsil se lene ke liye.',
    keywords: [
      'khatauni copy',
      'khasra khatauni nakal',
      'land record application',
      'bhulekh nakal',
      'खतौनी प्रति',
    ],
    recipientLines: {
      en: ['To,', 'The Tehsildar,', 'Tehsil {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान तहसीलदार महोदय,', 'तहसील {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of certified copy of Khatauni for Khasra No. {{khasraNumber}}.',
      hi: 'खसरा संख्या {{khasraNumber}} की प्रमाणित खतौनी प्रति हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, beg to state that I am the recorded owner / co-sharer of the agricultural land bearing Khasra No. {{khasraNumber}} situated in village {{village}}, tehsil {{tehsil}}.

I require a certified copy of the latest Khatauni for the purpose of {{purpose}}. The prescribed fee has been deposited and the receipt is enclosed.

I, therefore, request you to kindly issue the certified Khatauni copy at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, ग्राम {{village}}, तहसील {{tehsil}} स्थित खसरा संख्या {{khasraNumber}} की कृषि भूमि का दर्ज स्वामी/सह-स्वामी हूँ।

मुझे {{purpose}} हेतु नवीनतम खतौनी की प्रमाणित प्रति की आवश्यकता है। नियत शुल्क जमा किया जा चुका है तथा रसीद की प्रति संलग्न है।

अतः आपसे विनम्र निवेदन है कि कृपया प्रमाणित खतौनी प्रति शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'khasraNumber', label: 'Khasra number', type: 'text', required: true },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'loan / mutation / sale / court' },
    ],
  },
];
