import type { ApplicationTemplate } from './types';

/** Bank application templates — bilingual (English + Hindi). */
export const BANK_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'bank-account-opening',
    titleEn: 'New Bank Account Opening Request',
    titleHi: 'नया बैंक खाता खोलने हेतु आवेदन',
    category: 'bank',
    description: 'Bachat khata (savings account) ya current account khulwane ke liye.',
    keywords: [
      'open new bank account',
      'savings account opening',
      'naya khata khulwana',
      'bachat khata application',
      'खाता खोलना',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for opening a new {{accountType}} Account.',
      hi: 'नया {{accountType}} खाता खोलने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, mobile {{mobile}}, would like to open a new {{accountType}} Account in your prestigious bank. The purpose of opening the account is {{purpose}}.

All required documents — Aadhaar Card, PAN Card, two recent passport-size photographs, address proof and the duly filled KYC form — are enclosed. I shall maintain the prescribed minimum balance and abide by all rules of the bank.

I, therefore, request you to kindly open the account and issue the passbook, cheque book and debit card.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, मोबाइल {{mobile}}, आपके प्रतिष्ठित बैंक में नया {{accountType}} खाता खोलना चाहता/चाहती हूँ। खाता खोलने का उद्देश्य {{purpose}} है।

आवश्यक दस्तावेज़ — आधार कार्ड, पैन कार्ड, दो हाल ही के पासपोर्ट साइज़ फोटो, पता प्रमाण एवं विधिवत भरा हुआ KYC फॉर्म — इस आवेदन के साथ संलग्न हैं। मैं बैंक द्वारा निर्धारित न्यूनतम राशि का पालन करूँगा/करूँगी तथा बैंक के समस्त नियमों का अनुपालन करूँगा/करूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया मेरा खाता शीघ्र खोलकर पासबुक, चेक बुक एवं डेबिट कार्ड निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'accountType', label: 'Account type', type: 'text', default: 'Savings', hint: 'Savings / Current / Salary / NRE' },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'salary / business / personal savings' },
    ],
  },

  {
    slug: 'cheque-book-request',
    titleEn: 'Cheque Book Issue Request',
    titleHi: 'चेक बुक जारी करने हेतु आवेदन',
    category: 'bank',
    description: 'Bachat / current khata par nayi cheque book lene ke liye aavedan.',
    keywords: [
      'cheque book request',
      'naya cheque book',
      'cheque book issue',
      'चेक बुक आवेदन',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Request for issuance of a new Cheque Book.',
      hi: 'नई चेक बुक निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of Savings / Current Account number {{accountNumber}} at your branch, beg to state that the cheque book previously issued to me has been exhausted / lost. I now require a fresh cheque book of {{leaves}} leaves for my regular banking needs.

Kindly issue the new cheque book and inform me by SMS as soon as it is ready for collection.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, आपकी शाखा में खाता संख्या {{accountNumber}} का/की धारक हूँ। पहले निर्गत की गई चेक बुक समाप्त / गुम हो चुकी है। मुझे अपने नियमित बैंकिंग कार्यों हेतु {{leaves}} पन्नों की नई चेक बुक की आवश्यकता है।

अतः आपसे विनम्र निवेदन है कि कृपया नई चेक बुक शीघ्र निर्गत करने की कृपा करें तथा तैयार होते ही SMS द्वारा सूचित कर दें।`,
    },
    fields: [
      { id: 'leaves', label: 'Number of leaves', type: 'number', default: '25', hint: '25 / 50 / 100' },
    ],
  },

  {
    slug: 'atm-card-request',
    titleEn: 'ATM / Debit Card Issue Request',
    titleHi: 'ATM / डेबिट कार्ड हेतु आवेदन',
    category: 'bank',
    description: 'Naya ATM card ya debit card banwane ke liye aavedan.',
    keywords: [
      'ATM card request',
      'debit card application',
      'naya ATM card',
      'replacement ATM card',
      'डेबिट कार्ड आवेदन',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for issuance of {{cardType}} ATM / Debit Card.',
      hi: '{{cardType}} ATM / डेबिट कार्ड निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}} at your branch, would like to apply for a {{cardType}} ATM / Debit Card. The reason for this request is {{reason}}.

I shall use the card responsibly and abide by all rules and charges associated with it. Kindly issue the card at your earliest convenience.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, आपकी शाखा में खाता संख्या {{accountNumber}} का/की धारक हूँ। मुझे {{cardType}} ATM / डेबिट कार्ड की आवश्यकता है। इसका कारण {{reason}} है।

मैं कार्ड का उत्तरदायित्वपूर्ण उपयोग करूँगा/करूँगी तथा इस पर लागू समस्त नियमों एवं शुल्क का पालन करूँगा/करूँगी। अतः आपसे विनम्र निवेदन है कि कृपया कार्ड शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'cardType', label: 'Card type', type: 'text', default: 'Classic Debit', hint: 'Classic / Platinum / RuPay' },
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'first time / damaged / lost / blocked' },
    ],
  },

  {
    slug: 'bank-address-change',
    titleEn: 'Address / Contact Change Request',
    titleHi: 'बैंक खाते में पता परिवर्तन हेतु आवेदन',
    category: 'bank',
    description: 'Bank record mein address ya mobile number badalne ke liye.',
    keywords: [
      'bank address change',
      'mobile number change bank',
      'pata badalna bank',
      'KYC update bank',
      'पता परिवर्तन',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for change of {{changeField}} in my bank record.',
      hi: 'बैंक रिकॉर्ड में {{changeField}} परिवर्तन हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}}, beg to state that my {{changeField}} has been changed recently. The updated particulars are as follows:

• Old {{changeField}}: {{oldValue}}
• New {{changeField}}: {{newValue}}

A self-attested copy of {{proofDocument}} is enclosed as proof. Kindly update the same in your records and link my new contact / address to all banking services including SMS alerts, passbook, cheque book and debit card.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, खाता संख्या {{accountNumber}} का/की धारक हूँ। हाल ही में मेरा {{changeField}} परिवर्तित हो गया है। अद्यतन विवरण इस प्रकार है —

• पुराना {{changeField}} — {{oldValue}}
• नया {{changeField}} — {{newValue}}

प्रमाण के रूप में {{proofDocument}} की स्व-प्रमाणित प्रति संलग्न है। अतः आपसे विनम्र निवेदन है कि कृपया बैंक रिकॉर्ड अद्यतन करते हुए मेरे SMS अलर्ट, पासबुक, चेक बुक एवं डेबिट कार्ड पर भी नया विवरण लागू करने की कृपा करें।`,
    },
    fields: [
      { id: 'changeField', label: 'Field to change', type: 'text', required: true, hint: 'address / mobile / email' },
      { id: 'oldValue', label: 'Old value', type: 'text', required: true },
      { id: 'newValue', label: 'New value', type: 'text', required: true },
      { id: 'proofDocument', label: 'Proof document', type: 'text', required: true, hint: 'Aadhaar / electricity bill' },
    ],
  },

  {
    slug: 'bank-mobile-update',
    titleEn: 'Mobile Number Linking with Account',
    titleHi: 'खाते से मोबाइल नंबर लिंक करवाने हेतु आवेदन',
    category: 'bank',
    description: 'Bank account se naya mobile number link karne ke liye.',
    keywords: [
      'mobile linking bank',
      'register mobile bank account',
      'SMS alert activate',
      'mobile number bank update',
      'मोबाइल लिंक',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for linking mobile number with savings account.',
      hi: 'बचत खाते से मोबाइल नंबर लिंक करवाने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}}, beg to state that I wish to link / update my mobile number {{newMobile}} with my savings account so that I may receive SMS alerts, OTPs and avail mobile / internet banking services.

Kindly update the same in your records at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, खाता संख्या {{accountNumber}} का/की धारक हूँ। मैं अपने बचत खाते से मोबाइल नंबर {{newMobile}} लिंक / अद्यतन करवाना चाहता/चाहती हूँ ताकि SMS अलर्ट, OTP एवं मोबाइल / इंटरनेट बैंकिंग सेवाओं का लाभ ले सकूँ।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त मोबाइल नंबर बैंक रिकॉर्ड में अद्यतन करने की कृपा करें।`,
    },
    fields: [
      { id: 'newMobile', label: 'New mobile number', type: 'tel', required: true },
    ],
  },

  {
    slug: 'lost-passbook',
    titleEn: 'Lost Passbook / Cheque Book Replacement',
    titleHi: 'गुम पासबुक / चेक बुक रीप्लेसमेंट आवेदन',
    category: 'bank',
    description: 'Passbook ya cheque book gum / kharab hone par duplicate ke liye.',
    keywords: [
      'lost passbook',
      'cheque book lost',
      'duplicate passbook',
      'passbook missing',
      'पासबुक गुम',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for issuance of duplicate {{itemLost}}.',
      hi: 'गुम {{itemLost}} की डुप्लीकेट जारी करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}}, beg to inform that my {{itemLost}} has been lost / misplaced on {{lossDate}} at {{lossPlace}}. I have searched thoroughly but could not trace it.

Kindly block any further unauthorised use and issue a duplicate {{itemLost}} on my account. I am willing to pay the prescribed charges. Necessary indemnity / declaration is enclosed.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, खाता संख्या {{accountNumber}} का/की धारक हूँ। मेरी {{itemLost}} दिनांक {{lossDate}} को {{lossPlace}} पर खो / गुम हो गई है। पूरी खोजबीन के पश्चात भी वह नहीं मिल पायी है।

अतः आपसे विनम्र निवेदन है कि कृपया उसके किसी भी अनधिकृत प्रयोग को रोकते हुए मेरे खाते पर डुप्लीकेट {{itemLost}} शीघ्र निर्गत करने की कृपा करें। निर्धारित शुल्क मैं देने को तैयार हूँ। आवश्यक क्षतिपूर्ति प्रपत्र / घोषणा संलग्न है।`,
    },
    fields: [
      { id: 'itemLost', label: 'Item lost', type: 'text', required: true, hint: 'passbook / cheque book' },
      { id: 'lossDate', label: 'Date of loss', type: 'date', required: true },
      { id: 'lossPlace', label: 'Place of loss', type: 'text', required: true },
    ],
  },

  {
    slug: 'bank-loan-application',
    titleEn: 'Bank Loan Request Letter',
    titleHi: 'बैंक ऋण हेतु आवेदन',
    category: 'bank',
    description: 'Personal / home / vehicle / education loan ke liye bank aavedan.',
    keywords: [
      'bank loan',
      'personal loan',
      'home loan application',
      'vehicle loan',
      'education loan letter',
      'ऋण आवेदन',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for sanction of {{loanType}} of Rs. {{loanAmount}}.',
      hi: 'रुपये {{loanAmount}} का {{loanType}} स्वीकृत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, account number {{accountNumber}}, mobile {{mobile}}, beg to apply for a {{loanType}} of Rs. {{loanAmount}} ({{loanAmountWords}}) for the purpose of {{loanPurpose}}.

My monthly income is approximately Rs. {{monthlyIncome}} and I am willing to repay the loan in {{tenureMonths}} monthly instalments at the prevailing rate of interest. All required documents — KYC, salary / income proof, ITR, bank statement and applicable collateral details — are enclosed.

I assure you of timely repayment and request you to kindly process my loan application at the earliest. I shall remain grateful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, खाता संख्या {{accountNumber}}, मोबाइल {{mobile}}, {{loanPurpose}} हेतु रुपये {{loanAmount}} ({{loanAmountWords}}) का {{loanType}} स्वीकृत करवाना चाहता/चाहती हूँ।

मेरी मासिक आय लगभग रुपये {{monthlyIncome}} है तथा मैं इस ऋण को प्रचलित ब्याज दर पर {{tenureMonths}} मासिक किस्तों में चुकाने को तैयार हूँ। आवश्यक दस्तावेज़ — KYC, आय प्रमाण, ITR, बैंक स्टेटमेंट एवं उपयुक्त संपार्श्विक का विवरण — इस आवेदन के साथ संलग्न हैं।

मैं समय पर ऋण चुकाने का आश्वासन देता/देती हूँ। अतः आपसे विनम्र निवेदन है कि कृपया मेरा ऋण आवेदन शीघ्र संसाधित करने की कृपा करें।`,
    },
    fields: [
      { id: 'loanType', label: 'Loan type', type: 'text', required: true, hint: 'Personal / Home / Vehicle / Education' },
      { id: 'loanAmount', label: 'Loan amount (₹)', type: 'number', required: true },
      { id: 'loanAmountWords', label: 'Amount in words', type: 'text', required: true },
      { id: 'loanPurpose', label: 'Purpose', type: 'text', required: true },
      { id: 'monthlyIncome', label: 'Monthly income (₹)', type: 'number', required: true },
      { id: 'tenureMonths', label: 'Tenure (months)', type: 'number', default: '60' },
    ],
  },

  {
    slug: 'loan-noc',
    titleEn: 'Loan No-Objection Certificate (NOC)',
    titleHi: 'ऋण अदायगी NOC हेतु आवेदन',
    category: 'bank',
    description: 'Loan poora chukane ke baad NOC certificate ke liye aavedan.',
    keywords: [
      'loan NOC',
      'loan closure letter',
      'no objection bank loan',
      'home loan NOC',
      'vehicle loan NOC',
      'ऋण NOC',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for issuance of NOC for closed {{loanType}} (A/c {{loanAccount}}).',
      hi: 'पूर्णतः चुकाये गये {{loanType}} (खाता {{loanAccount}}) हेतु NOC निर्गत करने का आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of {{loanType}} account number {{loanAccount}}, beg to state that I have fully repaid the said loan on {{closureDate}}, including the last instalment, foreclosure / processing charges and any applicable interest.

Kindly issue a No-Objection Certificate (NOC) along with the loan-closure statement, and (if applicable) release the original property / vehicle documents, hypothecation papers and remove the lien from the RC / property record.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, आपके यहाँ {{loanType}} खाता संख्या {{loanAccount}} का/की धारक हूँ। मैंने उक्त ऋण की अंतिम किस्त, फोरक्लोज़र / प्रोसेसिंग शुल्क एवं समस्त लागू ब्याज सहित दिनांक {{closureDate}} को पूर्ण भुगतान कर दिया है।

अतः आपसे विनम्र निवेदन है कि कृपया मेरे लिए NOC (अनापत्ति प्रमाण पत्र) एवं ऋण-अवशेष शून्य प्रमाण पत्र निर्गत करने तथा (यदि लागू हो) मूल सम्पत्ति / वाहन के दस्तावेज़, हाइपोथिकेशन पत्र वापस करते हुए RC / सम्पत्ति रिकॉर्ड से बैंक का बंधक हटाने की कृपा करें।`,
    },
    fields: [
      { id: 'loanType', label: 'Loan type', type: 'text', required: true },
      { id: 'loanAccount', label: 'Loan account number', type: 'text', required: true },
      { id: 'closureDate', label: 'Closure date', type: 'date', required: true },
    ],
  },

  {
    slug: 'stop-payment',
    titleEn: 'Stop Payment of Cheque Request',
    titleHi: 'चेक भुगतान रोकने हेतु आवेदन',
    category: 'bank',
    description: 'Issued cheque ka payment rokne ke liye urgent aavedan.',
    keywords: [
      'stop payment',
      'cheque cancel',
      'cheque rokna',
      'stop cheque request',
      'चेक रोकना',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Urgent — Application for Stop Payment of Cheque No. {{chequeNumber}}.',
      hi: 'अति आवश्यक — चेक संख्या {{chequeNumber}} का भुगतान रोकने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}}, request you to immediately STOP the payment of the following cheque:

• Cheque number: {{chequeNumber}}
• Amount: Rs. {{chequeAmount}}
• Payee: {{payee}}
• Date of issue: {{issueDate}}
• Reason for stop: {{stopReason}}

Please take immediate action and confirm the stop-payment by SMS. I am willing to bear the prescribed charges.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, खाता संख्या {{accountNumber}} का/की धारक हूँ। कृपया निम्नलिखित चेक का भुगतान तुरन्त रोकने की कृपा करें —

• चेक संख्या — {{chequeNumber}}
• राशि — रुपये {{chequeAmount}}
• प्राप्तकर्ता — {{payee}}
• जारी करने की तिथि — {{issueDate}}
• रोकने का कारण — {{stopReason}}

कृपया तत्काल कार्रवाई करते हुए SMS द्वारा पुष्टि करने की कृपा करें। निर्धारित शुल्क मैं देने को तैयार हूँ।`,
    },
    fields: [
      { id: 'chequeNumber', label: 'Cheque number', type: 'text', required: true },
      { id: 'chequeAmount', label: 'Amount (₹)', type: 'number', required: true },
      { id: 'payee', label: 'Payee name', type: 'text', required: true },
      { id: 'issueDate', label: 'Issue date', type: 'date', required: true },
      { id: 'stopReason', label: 'Reason', type: 'text', required: true, hint: 'lost / disputed / dispute with party' },
    ],
  },

  {
    slug: 'net-banking-activation',
    titleEn: 'Net / Mobile Banking Activation Request',
    titleHi: 'नेट / मोबाइल बैंकिंग सक्रिय करवाने हेतु आवेदन',
    category: 'bank',
    description: 'Internet banking ya mobile banking activate karne ke liye.',
    keywords: [
      'net banking activate',
      'mobile banking activation',
      'online banking',
      'internet banking',
      'YONO',
      'UPI activate',
      'इंटरनेट बैंकिंग',
    ],
    recipientLines: {
      en: ['To,', 'The Branch Manager,', '{{bankName}}, {{bankBranch}} Branch'],
      hi: ['सेवा में,', 'श्रीमान शाखा प्रबन्धक,', '{{bankName}}, {{bankBranch}} शाखा'],
    },
    subject: {
      en: 'Application for activation of Internet Banking / Mobile Banking facility.',
      hi: 'इंटरनेट बैंकिंग / मोबाइल बैंकिंग सुविधा सक्रिय करवाने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of account number {{accountNumber}}, request you to kindly activate Internet Banking and Mobile Banking facilities on my account. The registered mobile number is {{mobile}} and the registered email is {{email}}.

I am aware of the responsibilities and security precautions associated with online banking and shall not share my login credentials / OTP with anyone. Kindly provide the user-id and initial password in a sealed cover.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, खाता संख्या {{accountNumber}} का/की धारक हूँ। कृपया मेरे खाते पर इंटरनेट बैंकिंग एवं मोबाइल बैंकिंग सुविधा सक्रिय करने की कृपा करें। पंजीकृत मोबाइल नंबर {{mobile}} एवं पंजीकृत ईमेल {{email}} है।

मैं ऑनलाइन बैंकिंग से जुड़ी ज़िम्मेदारियों एवं सुरक्षा सावधानियों से भली-भाँति परिचित हूँ तथा अपना लॉगिन विवरण / OTP किसी अन्य व्यक्ति से साझा नहीं करूँगा/करूँगी। कृपया यूज़र-आईडी एवं प्रारम्भिक पासवर्ड सीलबन्द लिफ़ाफ़े में प्रदान करने की कृपा करें।`,
    },
    fields: [],
  },
];
