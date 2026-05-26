import type { ApplicationTemplate } from './types';

/** School & College application templates — bilingual (English + Hindi). */
export const SCHOOL_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'sick-leave-school',
    titleEn: 'Sick Leave Application (Student)',
    titleHi: 'बीमारी की छुट्टी हेतु आवेदन (विद्यार्थी)',
    category: 'school',
    description: 'School / college mein bimari ki chhutti ke liye principal ko aavedan.',
    keywords: [
      'sick leave school',
      'bimari chhutti school',
      'leave application student',
      'principal sick leave',
      'बीमारी अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}, {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}, {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for sick leave from {{leaveFrom}} to {{leaveTo}}.',
      hi: 'दिनांक {{leaveFrom}} से {{leaveTo}} तक बीमारी अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I beg to state that I, {{fullName}}, a student of class {{className}}, roll number {{rollNumber}} of your school, am suffering from {{illness}} for the past few days. The doctor has advised complete bed rest, due to which I am unable to attend school.

Kindly grant me leave from {{leaveFrom}} to {{leaveTo}} ({{leaveDays}} days). I assure you that I shall complete the missed syllabus on rejoining. The medical certificate is enclosed.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, आपके विद्यालय की कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। विगत कुछ दिनों से मुझे {{illness}} हो गया है। चिकित्सक ने पूर्ण विश्राम की सलाह दी है, जिसके कारण मैं विद्यालय आने में असमर्थ हूँ।

अतः आपसे विनम्र निवेदन है कि कृपया मुझे दिनांक {{leaveFrom}} से {{leaveTo}} तक ({{leaveDays}} दिवस) का अवकाश प्रदान करने की कृपा करें। मैं वापस आने पर छूटा हुआ पाठ्यक्रम अवश्य पूर्ण करूँगा/करूँगी। चिकित्सकीय प्रमाण पत्र संलग्न है।`,
    },
    fields: [
      { id: 'illness', label: 'Illness / problem', type: 'text', required: true, hint: 'fever, viral, typhoid' },
      { id: 'leaveFrom', label: 'Leave from', type: 'date', required: true },
      { id: 'leaveTo', label: 'Leave till', type: 'date', required: true },
      { id: 'leaveDays', label: 'Total days', type: 'number', required: true, default: '3' },
    ],
  },

  {
    slug: 'casual-leave-school',
    titleEn: 'Casual Leave Application (Student)',
    titleHi: 'कैज़ुअल / सामान्य अवकाश आवेदन (विद्यार्थी)',
    category: 'school',
    description: 'Family function / shaadi / personal kaam ke liye chhutti ka aavedan.',
    keywords: [
      'casual leave school',
      'family function leave',
      'shaadi leave application',
      'personal leave student',
      'कैज़ुअल अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for casual leave on {{leaveDate}} due to {{reason}}.',
      hi: 'दिनांक {{leaveDate}} को {{reason}} के कारण अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a student of class {{className}}, roll number {{rollNumber}}, beg to state that an important {{reason}} is to take place at my home on {{leaveDate}}. My presence at the function is necessary, due to which I shall be unable to attend school.

Kindly grant me leave for {{leaveDays}} day(s) starting from {{leaveDate}}. I shall make sure to cover the missed lessons after returning.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। दिनांक {{leaveDate}} को मेरे घर पर एक महत्वपूर्ण {{reason}} है, जिसमें मेरी उपस्थिति अनिवार्य है। इस कारण मैं विद्यालय आने में असमर्थ रहूँगा/रहूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया मुझे दिनांक {{leaveDate}} से {{leaveDays}} दिवस का अवकाश प्रदान करने की कृपा करें। वापस आने पर छूटा हुआ पाठ्यक्रम मैं अवश्य पूर्ण करूँगा/करूँगी।`,
    },
    fields: [
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'wedding, religious function, family travel' },
      { id: 'leaveDate', label: 'Leave date(s)', type: 'date', required: true },
      { id: 'leaveDays', label: 'Number of days', type: 'number', default: '1' },
    ],
  },

  {
    slug: 'tc-application',
    titleEn: 'TC (Transfer Certificate) Request',
    titleHi: 'स्थानांतरण प्रमाण पत्र (TC) हेतु आवेदन',
    category: 'school',
    description: 'School chhodne ke liye Transfer Certificate request.',
    keywords: [
      'transfer certificate',
      'TC application',
      'school chhodne ka aavedan',
      'TC request principal',
      'स्थानांतरण प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}, {{village}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}, {{village}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for issuance of Transfer Certificate (TC).',
      hi: 'स्थानांतरण प्रमाण पत्र (TC) निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, was a student of class {{className}}, roll number {{rollNumber}} in your prestigious school during the academic session {{session}}.

Due to {{reason}} I am unable to continue my studies in this school any further and I now need to take admission in another institution. All school dues, library books and uniforms have been cleared. The fee deposit slip and original ID card are enclosed.

I, therefore, request you to kindly issue my Transfer Certificate at the earliest so that my admission in the new school may proceed without delay.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, सत्र {{session}} में आपके प्रतिष्ठित विद्यालय की कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी रहा/रही हूँ।

{{reason}} के कारण मैं इस विद्यालय में आगे की पढ़ाई जारी नहीं रख सकता/सकती तथा मुझे किसी अन्य विद्यालय में प्रवेश लेना है। विद्यालय का समस्त शुल्क, पुस्तकालय की पुस्तकें एवं वर्दी मैंने जमा कर दी है। शुल्क रसीद एवं मूल पहचान पत्र संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया मेरा स्थानांतरण प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें ताकि मेरा प्रवेश नये विद्यालय में बिना विलम्ब हो सके।`,
    },
    fields: [
      { id: 'session', label: 'Academic session', type: 'text', required: true, hint: '2025-26' },
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'family transfer, higher class, distance' },
    ],
  },

  {
    slug: 'bonafide-certificate',
    titleEn: 'Bonafide Certificate Request',
    titleHi: 'बोनाफाइड प्रमाण पत्र हेतु आवेदन',
    category: 'school',
    description: 'Scholarship / loan / passport ke liye bonafide praman patra.',
    keywords: [
      'bonafide certificate',
      'school bonafide',
      'student bonafide letter',
      'student verification letter',
      'बोनाफाइड पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for issuance of Bonafide Certificate.',
      hi: 'बोनाफाइड प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a regular student of class {{className}}, roll number {{rollNumber}}, beg to state that I require a Bonafide Certificate from the school for the purpose of {{purpose}}.

Kindly issue the same at the earliest. I shall remain grateful for your kind co-operation.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की नियमित विद्यार्थी हूँ। मुझे {{purpose}} हेतु विद्यालय से बोनाफाइड प्रमाण पत्र की आवश्यकता है।

अतः आपसे विनम्र निवेदन है कि कृपया मेरा बोनाफाइड प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'scholarship, education loan, passport, ID' },
    ],
  },

  {
    slug: 'character-certificate-school',
    titleEn: 'Character Certificate Request',
    titleHi: 'चरित्र प्रमाण पत्र हेतु आवेदन',
    category: 'school',
    description: 'School / college se character certificate ke liye aavedan.',
    keywords: [
      'character certificate',
      'school character certificate',
      'charitra praman patra',
      'चरित्र प्रमाण पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for issuance of Character Certificate.',
      hi: 'चरित्र प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, was a student of class {{className}} during the session {{session}} and have completed my schooling / course from your prestigious institution. I need a Character Certificate for the purpose of {{purpose}}.

During my time at school I always followed all rules and discipline. Kindly issue my Character Certificate at the earliest. I shall remain thankful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, सत्र {{session}} में आपके प्रतिष्ठित विद्यालय की कक्षा {{className}} का/की विद्यार्थी रहा/रही हूँ तथा अपनी शिक्षा यहीं से पूर्ण की है। मुझे {{purpose}} हेतु चरित्र प्रमाण पत्र की आवश्यकता है।

विद्यालय में अध्ययन के दौरान मैंने हमेशा अनुशासन एवं नियमों का पालन किया है। अतः आपसे विनम्र निवेदन है कि कृपया मेरा चरित्र प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'session', label: 'Session', type: 'text', required: true, hint: '2024-25' },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'higher studies / job / passport' },
    ],
  },

  {
    slug: 'fee-concession',
    titleEn: 'Fee Concession / Waiver Request',
    titleHi: 'शुल्क छूट / माफी हेतु आवेदन',
    category: 'school',
    description: 'Aarthik kamzori ke karan school fees mein chhoot ka aavedan.',
    keywords: [
      'fee concession',
      'fee waiver school',
      'fees maafi',
      'school fee discount',
      'शुल्क माफी',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for fee concession on grounds of financial hardship.',
      hi: 'आर्थिक स्थिति के दृष्टिगत विद्यालय शुल्क में छूट हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, am a student of class {{className}}, roll number {{rollNumber}}. My father is the only earning member of our family with an annual income of approximately Rs. {{annualIncome}}, which is barely enough to support our family of {{familyMembers}} members.

Due to severe financial hardship at home it is becoming extremely difficult for my family to bear the school fees. I have always been a sincere and disciplined student and continue to perform well in my studies.

I, therefore, humbly request you to kindly grant me a concession / waiver in the school fee so that I may continue my education without interruption. I shall remain forever grateful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, आपके विद्यालय की कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। मेरे पिता ही परिवार के एकमात्र कमाऊ सदस्य हैं तथा उनकी वार्षिक आय लगभग रुपये {{annualIncome}} है, जिससे {{familyMembers}} सदस्यों वाले परिवार का जीवन-यापन कठिनाई से होता है।

घरेलू आर्थिक स्थिति अत्यन्त कमज़ोर होने के कारण विद्यालय का शुल्क वहन करना मेरे परिवार के लिए अत्यन्त कठिन हो रहा है। मैं प्रारम्भ से ही अनुशासित एवं मेधावी छात्र/छात्रा हूँ तथा अध्ययन में सतत प्रगति कर रहा/रही हूँ।

अतः आपसे सादर निवेदन है कि कृपया मेरे विद्यालय शुल्क में पूर्ण/आंशिक छूट प्रदान करने की कृपा करें ताकि मेरी शिक्षा अबाध रूप से चलती रहे। मैं सदैव आभारी रहूँगा/रहूँगी।`,
    },
    fields: [
      { id: 'annualIncome', label: 'Family annual income (₹)', type: 'number', required: true },
      { id: 'familyMembers', label: 'Family members', type: 'number', default: '5' },
    ],
  },

  {
    slug: 'scholarship-application',
    titleEn: 'Scholarship Application',
    titleHi: 'छात्रवृत्ति हेतु आवेदन',
    category: 'school',
    description: 'Pre / post matric scholarship ke liye principal ko aavedan.',
    keywords: [
      'scholarship application',
      'chhatravritti aavedan',
      'pre matric scholarship',
      'post matric scholarship',
      'merit scholarship',
      'छात्रवृत्ति',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for {{scholarshipName}} Scholarship for the session {{session}}.',
      hi: 'सत्र {{session}} हेतु {{scholarshipName}} छात्रवृत्ति के लिए आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a student of class {{className}}, roll number {{rollNumber}}, wish to apply for the {{scholarshipName}} Scholarship for the academic session {{session}}.

I belong to {{casteCategory}} category and the annual income of my family is approximately Rs. {{annualIncome}}. I have consistently performed well in my studies and obtained {{lastPercentage}}% in my last examination. All required documents — caste certificate, income certificate, marksheet, bank passbook copy and Aadhaar — are enclosed.

I, therefore, request you to kindly forward my application for the said scholarship so that I may continue my education with dignity.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। मैं सत्र {{session}} हेतु {{scholarshipName}} छात्रवृत्ति के लिए आवेदन प्रस्तुत करना चाहता/चाहती हूँ।

मैं {{casteCategory}} श्रेणी का/की हूँ तथा मेरे परिवार की वार्षिक आय लगभग रुपये {{annualIncome}} है। मैं अध्ययन में सदा अच्छा प्रदर्शन करता/करती रहा/रही हूँ तथा पिछली परीक्षा में मुझे {{lastPercentage}}% अंक प्राप्त हुए हैं। सम्बन्धित समस्त दस्तावेज़ — जाति प्रमाण पत्र, आय प्रमाण पत्र, अंकपत्र, बैंक पासबुक प्रति एवं आधार — संलग्न हैं।

अतः आपसे विनम्र निवेदन है कि कृपया मेरा छात्रवृत्ति आवेदन सम्बन्धित विभाग को अग्रसारित करने की कृपा करें ताकि मैं अपनी शिक्षा सम्मानजनक ढंग से जारी रख सकूँ।`,
    },
    fields: [
      { id: 'scholarshipName', label: 'Scholarship name', type: 'text', required: true, hint: 'Pre-Matric / NSP / Merit' },
      { id: 'session', label: 'Session', type: 'text', required: true, default: '2025-26' },
      { id: 'casteCategory', label: 'Caste category', type: 'text', default: 'OBC' },
      { id: 'annualIncome', label: 'Annual income (₹)', type: 'number', required: true },
      { id: 'lastPercentage', label: 'Last exam %', type: 'number', required: true, default: '85' },
    ],
  },

  {
    slug: 'subject-change',
    titleEn: 'Change of Subject / Stream Request',
    titleHi: 'विषय / संकाय परिवर्तन हेतु आवेदन',
    category: 'school',
    description: 'Class 11 / college mein subject ya stream change karne ka aavedan.',
    keywords: [
      'subject change',
      'stream change',
      'class 11 subject change',
      'college subject change',
      'विषय परिवर्तन',
    ],
    recipientLines: {
      en: ['To,', 'The Principal,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान प्रधानाचार्य महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for change of subject from {{oldSubject}} to {{newSubject}}.',
      hi: 'विषय परिवर्तन — {{oldSubject}} से {{newSubject}} हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a student of class {{className}}, roll number {{rollNumber}}, beg to state that at the time of admission I had selected {{oldSubject}} as one of my optional subjects. After studying for some time I have realised that {{newSubject}} suits my interest and future career goals much better.

I, therefore, request you to kindly permit me to change my subject from {{oldSubject}} to {{newSubject}}. I assure you that I shall cover the missed portion at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। प्रवेश के समय मैंने {{oldSubject}} को एक वैकल्पिक विषय के रूप में चुना था, परन्तु कुछ समय अध्ययन करने के पश्चात मुझे यह अनुभव हुआ है कि {{newSubject}} मेरे रुचि एवं भविष्य की दृष्टि से अधिक उपयुक्त है।

अतः आपसे विनम्र निवेदन है कि कृपया मुझे {{oldSubject}} के स्थान पर {{newSubject}} विषय चुनने की अनुमति प्रदान करने की कृपा करें। छूटा हुआ पाठ्यक्रम मैं शीघ्र पूर्ण कर लूँगा/लूँगी।`,
    },
    fields: [
      { id: 'oldSubject', label: 'Old subject', type: 'text', required: true },
      { id: 'newSubject', label: 'New subject', type: 'text', required: true },
    ],
  },

  {
    slug: 'library-card',
    titleEn: 'Library Card / Membership Request',
    titleHi: 'पुस्तकालय कार्ड हेतु आवेदन',
    category: 'school',
    description: 'College / school library ka membership card banwane ke liye.',
    keywords: [
      'library card',
      'library membership',
      'college library card',
      'पुस्तकालय कार्ड',
    ],
    recipientLines: {
      en: ['To,', 'The Librarian,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान पुस्तकालय अध्यक्ष महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for issuance of Library Membership Card.',
      hi: 'पुस्तकालय सदस्यता कार्ड निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a student of class {{className}}, roll number {{rollNumber}}, would like to obtain the Library Membership Card so that I may borrow books for my studies and reference work. I shall strictly abide by all the rules and regulations of the library, including timely return of borrowed books.

Kindly issue my library card at the earliest. I shall remain thankful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, कक्षा {{className}}, अनुक्रमांक {{rollNumber}} का/की विद्यार्थी हूँ। मैं पुस्तकालय सदस्यता कार्ड प्राप्त करना चाहता/चाहती हूँ ताकि अध्ययन एवं सन्दर्भ हेतु पुस्तकें घर ले जा सकूँ। मैं पुस्तकालय के समस्त नियमों — विशेष रूप से समय पर पुस्तकें वापस करने — का पूर्ण पालन करूँगा/करूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया मेरा पुस्तकालय कार्ड शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [],
  },

  {
    slug: 'hostel-allotment',
    titleEn: 'Hostel Room Allotment Request',
    titleHi: 'छात्रावास आवंटन हेतु आवेदन',
    category: 'school',
    description: 'College hostel / boarding mein room allotment ke liye aavedan.',
    keywords: [
      'hostel allotment',
      'hostel room request',
      'boarding application',
      'college hostel application',
      'छात्रावास आवंटन',
    ],
    recipientLines: {
      en: ['To,', 'The Hostel Warden,', '{{schoolName}}'],
      hi: ['सेवा में,', 'श्रीमान छात्रावास अधीक्षक महोदय,', '{{schoolName}}'],
    },
    subject: {
      en: 'Application for hostel room allotment for the session {{session}}.',
      hi: 'सत्र {{session}} हेतु छात्रावास कक्ष आवंटन के लिए आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, a student of class {{className}} for the session {{session}}, beg to state that my permanent residence at {{address}} is approximately {{distance}} kilometres away from the college. The daily commute is causing serious difficulties in my studies.

I, therefore, request you to kindly allot me a room in the hostel so that I may pursue my studies effectively. I assure you that I shall strictly follow all hostel rules and discipline.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, सत्र {{session}} में कक्षा {{className}} का/की विद्यार्थी हूँ। मेरा स्थायी निवास {{address}} महाविद्यालय से लगभग {{distance}} किलोमीटर की दूरी पर है। प्रतिदिन इतनी लम्बी यात्रा करने से मेरी पढ़ाई में अत्यधिक कठिनाई हो रही है।

अतः आपसे विनम्र निवेदन है कि कृपया मुझे छात्रावास में एक कक्ष आवंटित करने की कृपा करें ताकि मैं भली-भाँति अध्ययन कर सकूँ। मैं छात्रावास के समस्त नियमों एवं अनुशासन का पालन सुनिश्चित करता/करती हूँ।`,
    },
    fields: [
      { id: 'session', label: 'Session', type: 'text', required: true, default: '2025-26' },
      { id: 'distance', label: 'Distance from college (km)', type: 'number', required: true, default: '40' },
    ],
  },
];
