import type { ApplicationTemplate } from './types';

/**
 * Bijli Vibhag (Electricity Dept) application templates — bilingual.
 * Covers the full common-issue lifecycle:
 *   • new connection
 *   • name transfer
 *   • wrong/excessive bill
 *   • no power complaint
 *   • meter replacement
 *   • load enhancement
 *   • permanent disconnection
 *   • reconnection after disconnection
 */
export const ELECTRICITY_TEMPLATES: ApplicationTemplate[] = [
  {
    slug: 'electricity-new-connection',
    titleEn: 'New Electricity Connection Application',
    titleHi: 'नई बिजली कनेक्शन हेतु आवेदन',
    category: 'electricity',
    description: 'Naya bijli connection (domestic / commercial) lene ke liye Vidyut Vibhag aavedan.',
    keywords: [
      'new electricity connection',
      'naya bijli connection',
      'bijli vibhag aavedan',
      'UPPCL new connection',
      'PVVNL connection',
      'domestic electricity connection',
      'नया बिजली कनेक्शन',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for new {{connectionType}} Electricity Connection at {{address}}.',
      hi: '{{address}} पर नया {{connectionType}} बिजली कनेक्शन हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, resident of {{address}}, village {{village}}, post {{post}}, tehsil {{tehsil}}, district {{district}}, am the lawful owner / tenant of the said premises and require a new {{connectionType}} electricity connection of {{loadKW}} kW load.

All required documents — Aadhaar Card, ownership / rent agreement, identity proof, passport-size photograph, and the prescribed application form / fee receipt — are attached herewith. I shall comply with all rules and regulations of the Electricity Department and shall pay all bills regularly.

I, therefore, request you to kindly survey the site at the earliest and sanction the new electricity connection so that my power supply may commence without delay.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी {{address}}, ग्राम {{village}}, पोस्ट {{post}}, तहसील {{tehsil}}, जनपद {{district}}, उक्त स्थान का/की विधिक स्वामी / किरायेदार हूँ। मुझे {{loadKW}} किलोवाट लोड का नया {{connectionType}} बिजली कनेक्शन चाहिए।

आवश्यक दस्तावेज़ — आधार कार्ड, स्वामित्व / किरायानामा, पहचान पत्र, पासपोर्ट साइज़ फोटो एवं निर्धारित आवेदन प्रपत्र / शुल्क रसीद — इस आवेदन के साथ संलग्न हैं। मैं विद्युत विभाग के समस्त नियमों एवं शर्तों का पालन करूँगा/करूँगी तथा बिजली बिल समय पर जमा करूँगा/करूँगी।

अतः आपसे विनम्र निवेदन है कि कृपया स्थान का शीघ्र सर्वे करवाकर नया बिजली कनेक्शन स्वीकृत करने की कृपा करें ताकि विद्युत आपूर्ति बिना विलम्ब प्रारम्भ हो सके।`,
    },
    fields: [
      { id: 'connectionType', label: 'Connection type', type: 'text', default: 'Domestic', hint: 'Domestic / Commercial / Agricultural' },
      { id: 'loadKW', label: 'Required load (kW)', type: 'number', required: true, default: '2' },
    ],
  },

  {
    slug: 'electricity-name-transfer',
    titleEn: 'Electricity Connection Name Transfer',
    titleHi: 'बिजली कनेक्शन नाम परिवर्तन हेतु आवेदन',
    category: 'electricity',
    description: 'Bijli connection ka naam doosre vyakti (purchase / wirasat) ke naam karwana.',
    keywords: [
      'electricity name transfer',
      'bijli connection name change',
      'meter name transfer',
      'inherited electricity connection',
      'नाम परिवर्तन बिजली',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for transfer of electricity connection (A/c No. {{accountNumber}}) in my name.',
      hi: 'बिजली कनेक्शन (खाता संख्या {{accountNumber}}) मेरे नाम स्थानांतरित करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, son/daughter of Shri {{fatherName}}, beg to state that the property situated at {{address}} has been transferred in my name by way of {{transferMode}} from Shri {{previousOwner}} on {{transferDate}}. The electricity connection (Account No. {{accountNumber}}, Meter No. {{meterNumber}}) is presently in the name of the previous owner.

All sale-deed / inheritance documents, NOC from the previous account holder, identity / address proof and the latest paid bill copy are enclosed.

I, therefore, request you to kindly transfer the said electricity connection in my name in your records at the earliest.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पुत्र/पुत्री श्री {{fatherName}}, का/की पता {{address}} स्थित सम्पत्ति दिनांक {{transferDate}} को {{transferMode}} के माध्यम से श्री {{previousOwner}} से मेरे नाम हस्तान्तरित हो चुकी है। उक्त सम्पत्ति का बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) वर्तमान में पूर्व स्वामी के नाम पर है।

विक्रय पत्र / वारिसान दस्तावेज़, पूर्व खाताधारक का NOC, पहचान / पता प्रमाण एवं नवीनतम बिल की प्रति इस आवेदन के साथ संलग्न है।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त बिजली कनेक्शन शीघ्र मेरे नाम स्थानांतरित करने की कृपा करें।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'previousOwner', label: 'Previous owner', type: 'text', required: true },
      { id: 'transferMode', label: 'Mode of transfer', type: 'text', default: 'sale deed', hint: 'sale / inheritance / gift' },
      { id: 'transferDate', label: 'Date of transfer', type: 'date', required: true },
    ],
  },

  {
    slug: 'electricity-wrong-bill',
    titleEn: 'Wrong / Excessive Electricity Bill Correction',
    titleHi: 'ग़लत / अधिक बिजली बिल सुधार हेतु आवेदन',
    category: 'electricity',
    description: 'Galat bill aaya hai / zyada bill aaya hai — sudhar ka aavedan.',
    keywords: [
      'galat bijli bill',
      'wrong electricity bill',
      'excessive bill complaint',
      'high bill correction',
      'bijli bill sudhar',
      'meter reading wrong',
      'अधिक बिजली बिल',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer / SDO,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता / SDO,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for correction of erroneous electricity bill for A/c No. {{accountNumber}}.',
      hi: 'खाता संख्या {{accountNumber}} पर ग़लत बिजली बिल सुधार हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}} (Meter No. {{meterNumber}}) for the premises at {{address}}, beg to state that the bill issued for the month of {{billMonth}} amounting to Rs. {{billedAmount}} appears to be highly erroneous.

In the same period of the previous year my bill used to be approximately Rs. {{normalAmount}}. There has been no change in my electrical load or consumption pattern. The meter reading recorded on the bill ({{billedReading}}) does not match the actual present reading on my meter, which is {{actualReading}}.

I, therefore, request you to kindly depute a competent official to verify the meter reading, correct the erroneous bill and issue a revised bill based on actual consumption. Until the correction is made, kindly do not initiate any disconnection action against my connection.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) का/की उपभोक्ता हूँ। माह {{billMonth}} में मुझे रुपये {{billedAmount}} का बिजली बिल प्राप्त हुआ है, जो अत्यन्त अधिक एवं ग़लत प्रतीत होता है।

विगत वर्ष इसी अवधि में मेरा बिल लगभग रुपये {{normalAmount}} आता था तथा मेरे विद्युत भार या उपभोग में कोई परिवर्तन नहीं हुआ है। बिल पर अंकित मीटर रीडिंग ({{billedReading}}) मीटर पर वर्तमान वास्तविक रीडिंग ({{actualReading}}) से मेल नहीं खाती।

अतः आपसे विनम्र निवेदन है कि कृपया किसी सक्षम अधिकारी को मेरे मीटर की जाँच हेतु भेजकर ग़लत बिल को सुधरवाने एवं वास्तविक उपभोग के आधार पर संशोधित बिल निर्गत कराने की कृपा करें। सुधार होने तक कृपया मेरे कनेक्शन पर कोई विच्छेदन (disconnection) कार्रवाई न की जाए।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'billMonth', label: 'Bill month', type: 'text', required: true, hint: 'जैसे — मई 2026' },
      { id: 'billedAmount', label: 'Billed amount (₹)', type: 'number', required: true },
      { id: 'normalAmount', label: 'Normal amount usually (₹)', type: 'number', required: true },
      { id: 'billedReading', label: 'Reading on bill', type: 'text', required: true },
      { id: 'actualReading', label: 'Actual present reading', type: 'text', required: true },
    ],
  },

  {
    slug: 'electricity-no-power',
    titleEn: 'No Power Supply / Power Cut Complaint',
    titleHi: 'बिजली आपूर्ति बाधित / बिजली नहीं आ रही — शिकायत',
    category: 'electricity',
    description: 'Mohalle mein / ghar mein bijli nahi aane ki shikayat letter.',
    keywords: [
      'no power supply',
      'bijli nahi aa rahi',
      'power cut complaint',
      'electricity outage letter',
      'transformer fail',
      'fuse off complaint',
      'बिजली नहीं आ रही',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer / Junior Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी / अवर अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Complaint regarding power supply failure at {{address}} for the past {{outageDuration}}.',
      hi: '{{address}} पर विगत {{outageDuration}} से बिजली आपूर्ति बाधित होने सम्बन्धी शिकायत।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}} for the premises at {{address}}, mohalla {{village}}, beg to inform you that there has been no electricity supply in our area for the past {{outageDuration}}. The cause appears to be {{suspectedCause}}.

Several residents of the area, including senior citizens, school-going children and sick patients, are facing severe inconvenience due to absence of light, water motors and fans / coolers. Repeated calls to the local complaint number have not produced any result so far.

I, therefore, request you to kindly send the line staff at the earliest, identify the fault and restore the power supply on a priority basis. I shall remain grateful for your prompt action.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}}, मोहल्ला {{village}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}) का/की उपभोक्ता हूँ। हमारे क्षेत्र में विगत {{outageDuration}} से बिजली की आपूर्ति बाधित है। समस्या का सम्भावित कारण {{suspectedCause}} प्रतीत हो रहा है।

बिजली न होने से क्षेत्र के अनेक निवासी — विशेष रूप से वृद्धजन, स्कूल जाने वाले बच्चे एवं रोगी — अत्यन्त परेशानी का सामना कर रहे हैं। लाइट, पानी की मोटर एवं पंखे/कूलर बन्द होने से कठिनाई बढ़ती जा रही है। स्थानीय शिकायत नंबर पर बार-बार सूचना देने के बावजूद अभी तक कोई कार्यवाही नहीं हुई है।

अतः आपसे विनम्र निवेदन है कि कृपया लाइन कर्मचारियों को तत्काल भेजकर समस्या का निदान कराने एवं बिजली आपूर्ति प्राथमिकता के आधार पर बहाल कराने की कृपा करें। आपकी अति कृपा होगी।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'outageDuration', label: 'Outage duration', type: 'text', required: true, hint: 'जैसे — 2 days / 36 hours' },
      { id: 'suspectedCause', label: 'Suspected cause', type: 'text', hint: 'transformer failure / cable damaged / fuse off', default: 'transformer failure' },
    ],
  },

  {
    slug: 'electricity-meter-replacement',
    titleEn: 'Faulty Meter Replacement Request',
    titleHi: 'ख़राब मीटर बदलवाने हेतु आवेदन',
    category: 'electricity',
    description: 'Meter kharab / jal gaya / fast chal raha hai — replacement aavedan.',
    keywords: [
      'meter replacement',
      'kharab meter',
      'meter burn',
      'meter fast running',
      'defective electricity meter',
      'मीटर बदलना',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer / SDO,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता / SDO,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for replacement of defective electricity meter (A/c No. {{accountNumber}}).',
      hi: 'खाता संख्या {{accountNumber}} पर ख़राब बिजली मीटर बदलने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}}, Meter No. {{meterNumber}}, at {{address}}, beg to inform you that the said meter has become defective. The specific problem observed is — {{meterProblem}}.

Due to this, the readings are not being recorded correctly and the bills generated are not reflecting actual consumption. Continuing with the defective meter is causing financial loss to me as well as inconvenience.

I, therefore, request you to kindly depute a technical team to inspect / test the meter and replace it with a new tested meter at the earliest. The prescribed inspection / testing fee shall be deposited as per rules.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) का/की उपभोक्ता हूँ। उक्त मीटर ख़राब हो चुका है। समस्या इस प्रकार है — {{meterProblem}}।

ख़राब मीटर के कारण रीडिंग ठीक से दर्ज नहीं हो पा रही है तथा बिल वास्तविक उपभोग के अनुरूप नहीं बन रहे, जिससे मुझे आर्थिक हानि एवं असुविधा हो रही है।

अतः आपसे विनम्र निवेदन है कि कृपया तकनीकी दल भेजकर मीटर की जाँच / परीक्षण कराते हुए शीघ्र नया परीक्षित मीटर लगवाने की कृपा करें। निर्धारित जाँच / परीक्षण शुल्क नियमानुसार जमा कर दिया जायेगा।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'meterProblem', label: 'Problem with meter', type: 'text', required: true, hint: 'meter burnt / display blank / fast running' },
    ],
  },

  {
    slug: 'electricity-load-enhancement',
    titleEn: 'Load Enhancement / Reduction Application',
    titleHi: 'विद्युत भार वृद्धि / कमी हेतु आवेदन',
    category: 'electricity',
    description: 'Bijli ka sanctioned load increase ya decrease karwana.',
    keywords: [
      'load enhancement',
      'load increase electricity',
      'load reduction',
      'bijli load badhaana',
      'kW load change',
      'विद्युत भार',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for {{action}} of sanctioned load on A/c No. {{accountNumber}}.',
      hi: 'खाता संख्या {{accountNumber}} पर स्वीकृत विद्युत भार {{action}} हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}} (Meter No. {{meterNumber}}) at {{address}}, beg to state that the present sanctioned load on my connection is {{currentLoad}} kW.

Due to {{reason}}, I now require the sanctioned load to be revised to {{newLoad}} kW. Continued use of the present load is either insufficient or unnecessarily higher than required and is causing inconvenience.

I, therefore, request you to kindly carry out a site inspection and {{action}} the sanctioned load on my connection at the earliest. The prescribed fee / security shall be deposited as per departmental rules.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) का/की उपभोक्ता हूँ। वर्तमान में मेरे कनेक्शन पर स्वीकृत विद्युत भार {{currentLoad}} किलोवाट है।

{{reason}} के कारण मुझे अब स्वीकृत भार बदलवाकर {{newLoad}} किलोवाट करवाना है। मौजूदा भार आवश्यकता के अनुसार या तो कम पड़ रहा है अथवा अनावश्यक रूप से अधिक है, जिससे असुविधा हो रही है।

अतः आपसे विनम्र निवेदन है कि कृपया स्थलीय निरीक्षण कराकर मेरे कनेक्शन पर स्वीकृत भार में {{action}} शीघ्र करवाने की कृपा करें। निर्धारित शुल्क / सुरक्षा राशि नियमानुसार जमा कर दी जायेगी।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'currentLoad', label: 'Current load (kW)', type: 'number', required: true, default: '2' },
      { id: 'newLoad', label: 'Required load (kW)', type: 'number', required: true, default: '5' },
      { id: 'action', label: 'Action', type: 'text', default: 'enhancement', hint: 'enhancement / reduction' },
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'new AC / motor installed, additional rooms' },
    ],
  },

  {
    slug: 'electricity-disconnection',
    titleEn: 'Permanent Disconnection Request',
    titleHi: 'स्थायी विद्युत विच्छेदन हेतु आवेदन',
    category: 'electricity',
    description: 'Bijli connection ko permanently band karwane (PD) ka aavedan.',
    keywords: [
      'permanent disconnection',
      'electricity PD',
      'bijli connection band',
      'PD application electricity',
      'final disconnection',
      'विद्युत विच्छेदन',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for permanent disconnection of electricity connection A/c No. {{accountNumber}}.',
      hi: 'खाता संख्या {{accountNumber}} पर स्थायी विद्युत विच्छेदन हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}} (Meter No. {{meterNumber}}) at {{address}}, beg to inform you that due to {{reason}} I no longer require electricity supply at the said premises with effect from {{cutOffDate}}.

I, therefore, request you to kindly carry out a Permanent Disconnection (PD) of the said connection, take the final meter reading, issue the final bill on the basis of that reading, and refund the security deposit lying with the department after the same is paid. The latest paid bill copy is attached.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) का/की उपभोक्ता हूँ। {{reason}} के कारण मुझे अब उक्त स्थान पर दिनांक {{cutOffDate}} से बिजली आपूर्ति की आवश्यकता नहीं है।

अतः आपसे विनम्र निवेदन है कि कृपया उक्त कनेक्शन का स्थायी विच्छेदन (PD) करते हुए अंतिम मीटर रीडिंग लेकर अंतिम बिल निर्गत करने तथा बिल भुगतान के पश्चात विभाग में जमा सुरक्षा राशि वापस करने की कृपा करें। नवीनतम भुगतान किया हुआ बिल संलग्न है।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'reason', label: 'Reason', type: 'text', required: true, hint: 'shifting, sold property, no longer needed' },
      { id: 'cutOffDate', label: 'Effective date', type: 'date', required: true },
    ],
  },

  {
    slug: 'electricity-reconnection',
    titleEn: 'Reconnection After Disconnection',
    titleHi: 'विच्छेदन के बाद पुन: कनेक्शन हेतु आवेदन',
    category: 'electricity',
    description: 'Bakaya bill jama karne ke baad reconnect karwane ka aavedan.',
    keywords: [
      'electricity reconnection',
      'reconnect after disconnect',
      'punah connection',
      'bijli reconnection',
      'पुन: कनेक्शन',
    ],
    recipientLines: {
      en: ['To,', 'The Executive Engineer,', 'Electricity Department, {{tehsil}}, District {{district}}'],
      hi: ['सेवा में,', 'श्रीमान अधिशासी अभियन्ता महोदय,', 'विद्युत विभाग, {{tehsil}}, जनपद {{district}}'],
    },
    subject: {
      en: 'Application for reconnection of electricity supply at A/c No. {{accountNumber}}.',
      hi: 'खाता संख्या {{accountNumber}} पर बिजली आपूर्ति पुन: चालू करने हेतु आवेदन।',
    },
    body: {
      en: `Respected Sir / Madam,

With due respect, I, {{fullName}}, holder of electricity connection bearing Account No. {{accountNumber}} (Meter No. {{meterNumber}}) at {{address}}, beg to inform you that the said connection was disconnected on {{disconnectDate}} due to non-payment of dues.

I have now deposited the entire outstanding amount of Rs. {{paidAmount}} along with the prescribed reconnection charges vide receipt no. {{receiptNumber}} dated {{paymentDate}}. A copy of the receipt is enclosed herewith.

I, therefore, request you to kindly arrange to restore my electricity supply at the earliest. I assure you that all future bills shall be paid on time.`,
      hi: `महोदय,

सविनय निवेदन है कि मैं, {{fullName}}, पता {{address}} स्थित आवास के बिजली कनेक्शन (खाता संख्या {{accountNumber}}, मीटर संख्या {{meterNumber}}) का/की उपभोक्ता हूँ। उक्त कनेक्शन दिनांक {{disconnectDate}} को बकाया बिल जमा न होने के कारण विच्छेदित कर दिया गया था।

अब मैंने सम्पूर्ण बकाया राशि रुपये {{paidAmount}} एवं निर्धारित पुन:जोड़ शुल्क रसीद संख्या {{receiptNumber}} दिनांक {{paymentDate}} द्वारा जमा कर दिया है। रसीद की प्रति इस आवेदन के साथ संलग्न है।

अतः आपसे विनम्र निवेदन है कि कृपया मेरी बिजली आपूर्ति शीघ्र पुन: चालू कराने की कृपा करें। मैं विश्वास दिलाता/दिलाती हूँ कि भविष्य के समस्त बिल समय पर जमा करूँगा/करूँगी।`,
    },
    fields: [
      { id: 'accountNumber', label: 'Electricity A/c No.', type: 'text', required: true },
      { id: 'meterNumber', label: 'Meter number', type: 'text', required: true },
      { id: 'disconnectDate', label: 'Disconnection date', type: 'date', required: true },
      { id: 'paidAmount', label: 'Amount paid (₹)', type: 'number', required: true },
      { id: 'receiptNumber', label: 'Receipt no.', type: 'text', required: true },
      { id: 'paymentDate', label: 'Payment date', type: 'date', required: true },
    ],
  },
];
