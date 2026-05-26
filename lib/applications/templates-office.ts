import type { ApplicationTemplate } from './types';

/** Office / Workplace application templates — bilingual (English + Hindi). */
export const OFFICE_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'sick-leave-office',
    titleEn: 'Sick Leave Application (Employee)',
    titleHi: 'बीमारी अवकाश हेतु आवेदन (कर्मचारी)',
    category: 'office',
    description: 'Office / company mein bimari ki chhutti ke liye HR / manager ko.',
    keywords: [
      'sick leave office',
      'bimari chhutti office',
      'medical leave',
      'employee sick leave',
      'बीमारी अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager / Reporting Manager,', '{{companyName}}, {{companyAddress}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर / रिपोर्टिंग मैनेजर,', '{{companyName}}, {{companyAddress}}'],
    },
    subject: {
      en: 'Application for sick leave from {{leaveFrom}} to {{leaveTo}}.',
      hi: 'दिनांक {{leaveFrom}} से {{leaveTo}} तक बीमारी अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, working as {{occupation}} (Employee ID {{employeeId}}) in your esteemed organisation, beg to state that I am suffering from {{illness}} since {{leaveFrom}}. The doctor has advised complete rest, due to which I shall not be able to attend office.

Kindly grant me sick leave from {{leaveFrom}} to {{leaveTo}} ({{leaveDays}} day(s)). My pending tasks have been handed over to {{handoverPerson}} and I am also reachable on {{mobile}} for any urgent matter. Medical certificate is enclosed.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, आपकी प्रतिष्ठित संस्था में {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। दिनांक {{leaveFrom}} से मुझे {{illness}} हो गया है। चिकित्सक ने पूर्ण विश्राम की सलाह दी है, जिसके कारण मैं कार्यालय आने में असमर्थ हूँ।

अतः आपसे विनम्र निवेदन है कि कृपया मुझे दिनांक {{leaveFrom}} से {{leaveTo}} तक ({{leaveDays}} दिवस) का अवकाश प्रदान करने की कृपा करें। मेरे लम्बित कार्य {{handoverPerson}} को सौंप दिये गये हैं तथा किसी आपातकालीन स्थिति में मैं {{mobile}} पर सम्पर्क हेतु उपलब्ध रहूँगा/रहूँगी। चिकित्सकीय प्रमाण पत्र संलग्न है।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'companyAddress', label: 'Company address', type: 'text' },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'illness', label: 'Illness', type: 'text', required: true },
      { id: 'leaveFrom', label: 'From', type: 'date', required: true },
      { id: 'leaveTo', label: 'To', type: 'date', required: true },
      { id: 'leaveDays', label: 'Days', type: 'number', required: true, default: '3' },
      { id: 'handoverPerson', label: 'Handover to', type: 'text', hint: 'colleague name' },
    ],
  },

  {
    slug: 'casual-leave-office',
    titleEn: 'Casual Leave Application (Employee)',
    titleHi: 'कैज़ुअल अवकाश हेतु आवेदन (कर्मचारी)',
    category: 'office',
    description: 'Personal kaam / family function ke liye 1-2 din ki chhutti.',
    keywords: [
      'casual leave office',
      'CL application',
      'personal leave employee',
      'family function leave office',
      'कैज़ुअल लीव',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager / Reporting Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर / रिपोर्टिंग मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for casual leave on {{leaveDate}} due to {{reason}}.',
      hi: 'दिनांक {{leaveDate}} को {{reason}} के कारण कैज़ुअल अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), beg to state that due to {{reason}} I shall be unable to attend office on {{leaveDate}}. Kindly grant me casual leave for {{leaveDays}} day(s). My pending work is being handled by {{handoverPerson}} and I am reachable on {{mobile}}.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। {{reason}} के कारण मैं दिनांक {{leaveDate}} को कार्यालय आने में असमर्थ रहूँगा/रहूँगी। कृपया मुझे {{leaveDays}} दिवस का कैज़ुअल अवकाश प्रदान करने की कृपा करें। मेरे लम्बित कार्य {{handoverPerson}} द्वारा देखे जायेंगे तथा आवश्यकता पड़ने पर मैं {{mobile}} पर उपलब्ध रहूँगा/रहूँगी।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'family function / urgent personal work' },
      { id: 'leaveDate', label: 'Leave date', type: 'date', required: true },
      { id: 'leaveDays', label: 'Days', type: 'number', default: '1' },
      { id: 'handoverPerson', label: 'Handover to', type: 'text' },
    ],
  },

  {
    slug: 'earned-leave',
    titleEn: 'Earned / Privilege Leave Request',
    titleHi: 'अर्जित अवकाश (EL / PL) हेतु आवेदन',
    category: 'office',
    description: 'Vacation / family trip ke liye earned leave ka aavedan.',
    keywords: [
      'earned leave',
      'privilege leave',
      'EL application',
      'PL application',
      'vacation leave office',
      'अर्जित अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for earned leave from {{leaveFrom}} to {{leaveTo}}.',
      hi: 'दिनांक {{leaveFrom}} से {{leaveTo}} तक अर्जित अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, working as {{occupation}} (Employee ID {{employeeId}}), wish to take earned / privilege leave for {{leaveDays}} day(s) from {{leaveFrom}} to {{leaveTo}} for the purpose of {{purpose}}.

I have a sufficient balance of earned leave to my credit. My pending work shall be handed over to {{handoverPerson}} before I proceed on leave, and I shall remain reachable on {{mobile}} in case of any urgency.

Kindly approve my leave application.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। {{purpose}} हेतु मैं दिनांक {{leaveFrom}} से {{leaveTo}} तक ({{leaveDays}} दिवस) का अर्जित अवकाश लेना चाहता/चाहती हूँ।

मेरे खाते में पर्याप्त अर्जित अवकाश शेष है। अवकाश पर जाने से पूर्व मैं अपने समस्त लम्बित कार्य {{handoverPerson}} को सौंप दूँगा/दूँगी तथा किसी आपात स्थिति में मैं {{mobile}} पर उपलब्ध रहूँगा/रहूँगी।

कृपया मेरा अवकाश आवेदन स्वीकार करने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'family wedding / vacation / travel' },
      { id: 'leaveFrom', label: 'From', type: 'date', required: true },
      { id: 'leaveTo', label: 'To', type: 'date', required: true },
      { id: 'leaveDays', label: 'Days', type: 'number', required: true },
      { id: 'handoverPerson', label: 'Handover to', type: 'text' },
    ],
  },

  {
    slug: 'maternity-leave',
    titleEn: 'Maternity Leave Application',
    titleHi: 'मातृत्व अवकाश हेतु आवेदन',
    category: 'office',
    description: 'Working women ke liye maternity leave ka aavedan.',
    keywords: [
      'maternity leave',
      'pregnancy leave office',
      'maternity benefit',
      'matritva avkash',
      'मातृत्व अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for Maternity Leave from {{leaveFrom}} to {{leaveTo}}.',
      hi: 'दिनांक {{leaveFrom}} से {{leaveTo}} तक मातृत्व अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), wish to inform you that I am expecting my baby in {{expectedMonth}}. On the advice of my doctor, I would like to avail Maternity Leave under the Maternity Benefit Act, 2017 from {{leaveFrom}} to {{leaveTo}}, totalling {{leaveDays}} days.

A copy of the medical certificate stating the expected date of delivery is enclosed. My current responsibilities shall be handed over to {{handoverPerson}} before I proceed on leave. Kindly grant me Maternity Leave as per the company policy.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। मैं {{expectedMonth}} में अपने शिशु के जन्म की प्रतीक्षा कर रही हूँ। चिकित्सक की सलाह के अनुसार मातृत्व लाभ अधिनियम, 2017 के अन्तर्गत मैं दिनांक {{leaveFrom}} से {{leaveTo}} तक कुल {{leaveDays}} दिवस का मातृत्व अवकाश लेना चाहती हूँ।

अनुमानित प्रसव तिथि से सम्बन्धित चिकित्सकीय प्रमाण पत्र संलग्न है। अवकाश पर जाने से पूर्व मेरे समस्त कार्य {{handoverPerson}} को सौंप दिये जायेंगे।

अतः आपसे विनम्र निवेदन है कि कृपया कम्पनी की नीति के अनुसार मातृत्व अवकाश स्वीकृत करने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'expectedMonth', label: 'Expected delivery month', type: 'text', required: true },
      { id: 'leaveFrom', label: 'Leave from', type: 'date', required: true },
      { id: 'leaveTo', label: 'Leave till', type: 'date', required: true },
      { id: 'leaveDays', label: 'Days', type: 'number', default: '180' },
      { id: 'handoverPerson', label: 'Handover to', type: 'text' },
    ],
  },

  {
    slug: 'paternity-leave',
    titleEn: 'Paternity Leave Application',
    titleHi: 'पितृत्व अवकाश हेतु आवेदन',
    category: 'office',
    description: 'Baby birth ke samay paternity leave ka aavedan.',
    keywords: [
      'paternity leave',
      'father leave new baby',
      'पितृत्व अवकाश',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for Paternity Leave from {{leaveFrom}} to {{leaveTo}}.',
      hi: 'दिनांक {{leaveFrom}} से {{leaveTo}} तक पितृत्व अवकाश हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), beg to inform you that my wife is expecting our child around {{expectedDate}}. To attend to her and the newborn, I would like to avail Paternity Leave from {{leaveFrom}} to {{leaveTo}} ({{leaveDays}} days) as per company policy.

Kindly grant me the said leave. My pending work has been handed over to {{handoverPerson}}.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। मेरी पत्नी का अनुमानित प्रसव दिनांक {{expectedDate}} है। पत्नी एवं नवजात शिशु की देखभाल हेतु मैं कम्पनी की नीति के अनुसार दिनांक {{leaveFrom}} से {{leaveTo}} तक ({{leaveDays}} दिवस) का पितृत्व अवकाश लेना चाहता हूँ।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त अवकाश स्वीकृत करने की कृपा करें। मेरे लम्बित कार्य {{handoverPerson}} को सौंप दिये गये हैं।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'expectedDate', label: 'Expected delivery date', type: 'date', required: true },
      { id: 'leaveFrom', label: 'Leave from', type: 'date', required: true },
      { id: 'leaveTo', label: 'Leave till', type: 'date', required: true },
      { id: 'leaveDays', label: 'Days', type: 'number', default: '15' },
      { id: 'handoverPerson', label: 'Handover to', type: 'text' },
    ],
  },

  {
    slug: 'resignation-letter',
    titleEn: 'Resignation Letter',
    titleHi: 'त्यागपत्र (Resignation)',
    category: 'office',
    description: 'Job chhodne ke liye professional resignation letter.',
    keywords: [
      'resignation letter',
      'tyagpatra',
      'job resign',
      'notice period',
      'resignation email',
      'त्यागपत्र',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}, {{companyAddress}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}, {{companyAddress}}'],
    },
    subject: {
      en: 'Resignation from the post of {{occupation}}.',
      hi: '{{occupation}} पद से त्यागपत्र।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, presently working as {{occupation}} (Employee ID {{employeeId}}) since {{joinDate}}, wish to tender my resignation from the said post effective {{lastWorkingDate}}.

The reason for my decision is {{resignReason}}. I have taken this decision after careful thought and request you to kindly accept the same. I shall be serving the notice period of {{noticeDays}} days from today and shall ensure smooth handover of all responsibilities and pending tasks during this time.

I take this opportunity to sincerely thank the management for the opportunities, learning and support extended to me during my association with {{companyName}}. Kindly initiate the formalities of my full-and-final settlement, relieving letter and experience certificate.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{joinDate}} से आपकी प्रतिष्ठित संस्था में {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर कार्यरत हूँ। मैं {{lastWorkingDate}} से प्रभावी इस पद से त्यागपत्र प्रस्तुत कर रहा/रही हूँ।

इसका कारण {{resignReason}} है। मैंने यह निर्णय सोच-समझ कर लिया है, अतः कृपया मेरा त्यागपत्र स्वीकार करने की कृपा करें। मैं आज से अगले {{noticeDays}} दिवस की नोटिस अवधि पूर्ण करूँगा/करूँगी तथा अपने समस्त उत्तरदायित्व एवं लम्बित कार्य व्यवस्थित रूप से हस्तान्तरित करना सुनिश्चित करूँगा/करूँगी।

{{companyName}} द्वारा प्रदान किए गए अवसरों, अनुभवों एवं सहयोग के लिए मैं हार्दिक धन्यवाद ज्ञापित करता/करती हूँ। कृपया मेरा फुल-एंड-फाइनल सेटलमेंट, रिलीविंग लेटर एवं अनुभव प्रमाण पत्र निर्गत करने की प्रक्रिया प्रारम्भ करने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'companyAddress', label: 'Company address', type: 'text' },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'joinDate', label: 'Date of joining', type: 'date', required: true },
      { id: 'lastWorkingDate', label: 'Proposed last day', type: 'date', required: true },
      { id: 'resignReason', label: 'Reason', type: 'text', required: true, hint: 'better opportunity / family / studies' },
      { id: 'noticeDays', label: 'Notice period (days)', type: 'number', default: '30' },
    ],
  },

  {
    slug: 'salary-increment',
    titleEn: 'Salary Increment Request',
    titleHi: 'वेतन वृद्धि (इन्क्रीमेंट) हेतु आवेदन',
    category: 'office',
    description: 'Manager ko likhi gayi salary increment request letter.',
    keywords: [
      'salary increment',
      'salary hike request',
      'appraisal letter',
      'vetan vriddhi',
      'pay raise letter',
      'वेतन वृद्धि',
    ],
    recipientLines: {
      en: ['To,', 'The Reporting Manager / HR,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान रिपोर्टिंग मैनेजर / एच.आर.,', '{{companyName}}'],
    },
    subject: {
      en: 'Request for review of salary and increment.',
      hi: 'वेतन समीक्षा एवं वेतन वृद्धि हेतु अनुरोध।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), have been associated with {{companyName}} since {{joinDate}}. During this tenure I have consistently delivered on my responsibilities and contributed to projects including {{contributions}}.

It has been {{monthsSinceIncrement}} months since my last salary review. I would like to request your kind consideration for an increment from my present salary of Rs. {{currentCTC}} per annum to Rs. {{requestedCTC}} per annum, in line with my performance, the increasing cost of living and current market trends for similar roles.

I remain fully committed to the organisation and look forward to continuing to add value. I shall be grateful for your kind consideration.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर {{joinDate}} से {{companyName}} में कार्यरत हूँ। इस अवधि में मैंने सौंपे गए दायित्वों का निष्ठापूर्वक निर्वहन किया है तथा {{contributions}} जैसे महत्वपूर्ण कार्यों में योगदान दिया है।

मेरी पिछली वेतन समीक्षा को {{monthsSinceIncrement}} माह व्यतीत हो चुके हैं। मेरे प्रदर्शन, बढ़ती महंगाई एवं समान भूमिकाओं के वर्तमान बाज़ार मानकों को ध्यान में रखते हुए मेरा वर्तमान वेतन रुपये {{currentCTC}} प्रति वर्ष से बढ़ाकर रुपये {{requestedCTC}} प्रति वर्ष करने पर सकारात्मक विचार करने की कृपा करें।

मैं संस्था के प्रति पूर्णतः समर्पित हूँ तथा आगे भी संस्था को और अधिक मूल्य देने के लिए तत्पर रहूँगा/रहूँगी। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'joinDate', label: 'Date of joining', type: 'date', required: true },
      { id: 'contributions', label: 'Key contributions', type: 'textarea', required: true, rows: 3 },
      { id: 'monthsSinceIncrement', label: 'Months since last increment', type: 'number', default: '12' },
      { id: 'currentCTC', label: 'Current CTC (₹)', type: 'number', required: true },
      { id: 'requestedCTC', label: 'Requested CTC (₹)', type: 'number', required: true },
    ],
  },

  {
    slug: 'transfer-request',
    titleEn: 'Transfer / Relocation Request',
    titleHi: 'स्थानांतरण (ट्रांसफर) हेतु आवेदन',
    category: 'office',
    description: 'Doosre branch / city mein transfer ke liye HR aavedan.',
    keywords: [
      'transfer letter',
      'relocation request',
      'inter-branch transfer',
      'home town transfer',
      'स्थानांतरण आवेदन',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Request for transfer from {{currentBranch}} to {{requestedBranch}}.',
      hi: '{{currentBranch}} से {{requestedBranch}} स्थानांतरण हेतु अनुरोध।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), have been working at the {{currentBranch}} branch since {{joinDate}}.

I would like to request a transfer to the {{requestedBranch}} branch on account of {{transferReason}}. Such a transfer would help me address my personal / family situation while also enabling me to continue serving the organisation with the same dedication.

I shall remain committed to the company and shall ensure a smooth handover of my current responsibilities before relocating. Kindly consider my request favourably.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर {{joinDate}} से {{currentBranch}} शाखा में कार्यरत हूँ।

{{transferReason}} के कारण मैं अपना स्थानांतरण {{currentBranch}} से {{requestedBranch}} शाखा में करवाना चाहता/चाहती हूँ। उक्त स्थानांतरण से मैं अपनी व्यक्तिगत/पारिवारिक स्थिति का समाधान कर सकूँगा/सकूँगी तथा संस्था की सेवा भी उसी निष्ठा से जारी रख सकूँगा/सकूँगी।

मैं संस्था के प्रति पूर्णतः प्रतिबद्ध हूँ तथा स्थानांतरण से पूर्व अपने वर्तमान कार्य व्यवस्थित रूप से हस्तान्तरित करना सुनिश्चित करूँगा/करूँगी। कृपया मेरे आवेदन पर सकारात्मक विचार करने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'joinDate', label: 'Date of joining', type: 'date', required: true },
      { id: 'currentBranch', label: 'Current branch / city', type: 'text', required: true },
      { id: 'requestedBranch', label: 'Requested branch / city', type: 'text', required: true },
      { id: 'transferReason', label: 'Reason', type: 'text', required: true, hint: 'family, health, marriage, parents care' },
    ],
  },

  {
    slug: 'employer-noc',
    titleEn: 'Employer NOC for Passport / Visa / Loan',
    titleHi: 'नियोक्ता NOC (पासपोर्ट / वीज़ा / ऋण हेतु)',
    category: 'office',
    description: 'Passport / visa / loan ke liye employer ki No-Objection letter.',
    keywords: [
      'employer NOC',
      'NOC for passport',
      'NOC for visa',
      'NOC for loan',
      'company NOC letter',
      'नियोक्ता NOC',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for No-Objection Certificate (NOC) for {{purpose}}.',
      hi: '{{purpose}} हेतु अनापत्ति प्रमाण पत्र (NOC) के लिए आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), working with {{companyName}} since {{joinDate}}, request you to kindly issue an NOC in my favour for the purpose of {{purpose}}.

The NOC is required by {{noccAuthority}}. I assure you that the said purpose shall in no way affect my professional commitments. Kindly issue the certificate at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर {{joinDate}} से {{companyName}} में कार्यरत हूँ। मुझे {{purpose}} हेतु संस्था की ओर से अनापत्ति प्रमाण पत्र (NOC) की आवश्यकता है।

यह प्रमाण पत्र {{noccAuthority}} द्वारा माँगा गया है। मैं विश्वास दिलाता/दिलाती हूँ कि उपर्युक्त कार्य से मेरे कार्यालयी दायित्वों पर कोई प्रभाव नहीं पड़ेगा। अतः कृपया प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'joinDate', label: 'Joining date', type: 'date', required: true },
      { id: 'purpose', label: 'NOC purpose', type: 'text', required: true, hint: 'Passport / Visa / Home Loan' },
      { id: 'noccAuthority', label: 'Authority needing NOC', type: 'text', required: true, hint: 'Passport Office / Embassy / Bank' },
    ],
  },

  {
    slug: 'experience-letter',
    titleEn: 'Experience / Service Letter Request',
    titleHi: 'अनुभव प्रमाण पत्र हेतु आवेदन',
    category: 'office',
    description: 'Resignation ke baad / current job ke saath experience certificate.',
    keywords: [
      'experience letter',
      'service certificate',
      'anubhav patra',
      'experience certificate request',
      'अनुभव पत्र',
    ],
    recipientLines: {
      en: ['To,', 'The HR Manager,', '{{companyName}}'],
      hi: ['सेवा में,', 'श्रीमान एच.आर. मैनेजर,', '{{companyName}}'],
    },
    subject: {
      en: 'Application for issuance of Experience / Service Letter.',
      hi: 'अनुभव / सेवा प्रमाण पत्र निर्गत करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, {{occupation}} (Employee ID {{employeeId}}), have served / am serving {{companyName}} from {{joinDate}} to {{endDate}} in the {{department}} department.

I require an Experience / Service Letter on the company letterhead clearly mentioning my designation, period of service, last drawn CTC and a brief on the responsibilities handled, for the purpose of {{purpose}}.

Kindly issue the letter at your earliest convenience. I shall remain grateful.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, {{occupation}} (कर्मचारी आईडी {{employeeId}}) के पद पर {{joinDate}} से {{endDate}} तक {{companyName}} के {{department}} विभाग में सेवारत रहा/रही हूँ / सेवारत हूँ।

मुझे {{purpose}} हेतु कम्पनी लेटरहेड पर एक अनुभव / सेवा प्रमाण पत्र की आवश्यकता है जिसमें मेरा पद, कार्यावधि, अंतिम CTC एवं उत्तरदायित्वों का संक्षिप्त विवरण उल्लिखित हो।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'companyName', label: 'Company name', type: 'text', required: true },
      { id: 'employeeId', label: 'Employee ID', type: 'text' },
      { id: 'department', label: 'Department', type: 'text', required: true },
      { id: 'joinDate', label: 'Joining date', type: 'date', required: true },
      { id: 'endDate', label: 'Last working date', type: 'date', required: true },
      { id: 'purpose', label: 'Purpose', type: 'text', required: true, hint: 'next job / higher studies / visa' },
    ],
  },
];
