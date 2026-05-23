'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Sliders, 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  AlertTriangle, 
  Sparkles,
  ArrowRight,
  Minimize
} from 'lucide-react';

interface Preset {
  name: string;
  type: 'photo' | 'signature' | 'document';
  maxWidth: number;
  maxHeight: number;
  maxKB: number;
  minKB?: number;
  hindiDesc: string;
}

const PRESETS: Record<string, Preset> = {
  'up-police-photo': {
    name: 'UP Police Constable/SI Photo',
    type: 'photo',
    maxWidth: 350,
    maxHeight: 450,
    maxKB: 50,
    minKB: 20,
    hindiDesc: 'यूपी पुलिस फोटो (20KB - 50KB, रंगीन व साफ पृष्ठभूमि)',
  },
  'up-police-sign': {
    name: 'UP Police Constable/SI Signature',
    type: 'signature',
    maxWidth: 350,
    maxHeight: 150,
    maxKB: 20,
    minKB: 5,
    hindiDesc: 'यूपी पुलिस हस्ताक्षर (5KB - 20KB, काली स्याही से)',
  },
  'ssc-photo': {
    name: 'SSC CGL/CHSL/MTS Photo',
    type: 'photo',
    maxWidth: 350,
    maxHeight: 450,
    maxKB: 50,
    minKB: 20,
    hindiDesc: 'एसएससी फोटो (20KB - 50KB, बिना चश्मे व टोपी के)',
  },
  'ssc-sign': {
    name: 'SSC CGL/CHSL/MTS Signature',
    type: 'signature',
    maxWidth: 350,
    maxHeight: 150,
    maxKB: 20,
    minKB: 10,
    hindiDesc: 'एसएससी हस्ताक्षर (10KB - 20KB, स्पष्ट व साफ)',
  },
  'upsssc-photo': {
    name: 'UPSSSC PET Photo',
    type: 'photo',
    maxWidth: 350,
    maxHeight: 450,
    maxKB: 50,
    hindiDesc: 'यूपीएसएसएससी पीईटी फोटो (अधिकतम 50KB, ताजा खींची गई)',
  },
  'upsssc-sign': {
    name: 'UPSSSC PET Signature',
    type: 'signature',
    maxWidth: 350,
    maxHeight: 150,
    maxKB: 20,
    hindiDesc: 'यूपीएसएसएससी पीईटी हस्ताक्षर (अधिकतम 20KB, स्पष्ट)',
  },
  'up-scholarship-photo': {
    name: 'UP Scholarship Photo',
    type: 'photo',
    maxWidth: 350,
    maxHeight: 450,
    maxKB: 20,
    hindiDesc: 'यूपी स्कॉलरशिप फोटो (अधिकतम 20KB)',
  },
  'custom-photo': {
    name: 'Custom Resizing / कस्टम फोटो सेटिंग',
    type: 'photo',
    maxWidth: 600,
    maxHeight: 600,
    maxKB: 50,
    hindiDesc: 'अपनी मर्जी के अनुसार साइज व KB सेट करें',
  }
};

export default function PhotoResizerPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>('up-police-photo');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [resizedSize, setResizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [customWidth, setCustomWidth] = useState<number>(350);
  const [customHeight, setCustomHeight] = useState<number>(450);
  const [customMaxKB, setCustomMaxKB] = useState<number>(50);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePreset = PRESETS[selectedPresetKey];

  useEffect(() => {
    if (activePreset && selectedPresetKey !== 'custom-photo') {
      setCustomWidth(activePreset.maxWidth);
      setCustomHeight(activePreset.maxHeight);
      setCustomMaxKB(activePreset.maxKB);
    }
  }, [selectedPresetKey, activePreset]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setResizedUrl('');
    setResizedSize(0);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation
      if (!file.type.startsWith('image/')) {
        setErrorMsg('कृपया केवल इमेज फाइल (JPG, JPEG, PNG) अपलोड करें / Please select only image files.');
        return;
      }

      setImageFile(file);
      setOriginalSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOriginalUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setResizedUrl('');
    setResizedSize(0);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('कृपया केवल इमेज फाइल अपलोड करें / Please select only image files.');
        return;
      }
      setImageFile(file);
      setOriginalSize(file.size);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOriginalUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Process & Resize Image purely client side
  const processImage = () => {
    if (!originalUrl || !imageFile) return;

    setIsProcessing(true);
    setErrorMsg('');

    const img = new Image();
    img.src = originalUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setErrorMsg('ब्राउज़र कंपैटिबिलिटी एरर / Canvas context not supported.');
        setIsProcessing(false);
        return;
      }

      // Set target width and height
      const targetW = customWidth;
      const targetH = customHeight;
      canvas.width = targetW;
      canvas.height = targetH;

      // Draw image on canvas stretching/filling exactly to specs (standard photo resizing practice)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Iterative Compression algorithm to get file size under the target KB
      const targetMaxBytes = customMaxKB * 1024;
      let quality = 0.95;
      let currentBase64 = '';
      let currentSizeBytes = 0;
      let iterationCount = 0;

      // Keep compressing until it fits the KB limit or quality gets too low (0.1)
      do {
        currentBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Approximate bytes count from base64 string
        const base64Content = currentBase64.split(',')[1];
        currentSizeBytes = Math.round((base64Content.length * 3) / 4);
        
        // Step down quality
        quality -= 0.05;
        iterationCount++;
      } while (currentSizeBytes > targetMaxBytes && quality > 0.1 && iterationCount < 20);

      // Final output assignment
      setResizedUrl(currentBase64);
      setResizedSize(currentSizeBytes);
      setIsProcessing(false);
      setShowSuccessToast(true);

      // Scroll down to preview section
      setTimeout(() => {
        const previewElement = document.getElementById('resizer-results');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    };

    img.onerror = () => {
      setErrorMsg('इमेज लोड करने में असमर्थ / Failed to load image.');
      setIsProcessing(false);
    };
  };

  const downloadResized = () => {
    if (!resizedUrl) return;
    
    // Create clean download link
    const link = document.createElement('a');
    
    // Generate clean filename
    const presetNameClean = activePreset.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.download = `etawahjan_resized_${presetNameClean}.jpg`;
    link.href = resizedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetForm = () => {
    setImageFile(null);
    setOriginalUrl('');
    setOriginalSize(0);
    setResizedUrl('');
    setResizedSize(0);
    setErrorMsg('');
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleChatOpen = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('openChat'));
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 text-slate-800">
        
        {/* Top Header Section */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-5xl text-center">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-4 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Etawah Jan Seva Kendra Free Online Tool
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
              Sarkari Photo & Signature Resizer
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              सरकारी नौकरी फॉर्म के लिए फोटो व सिग्नेचर को तुरंत 20KB, 50KB, 100KB में बिना धुंधला किये ऑनलाइन रीसाइज़ करें। 100% मुफ्त व सुरक्षित!
            </p>
          </div>
        </section>

        {/* Tool Main Body */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-5xl">
            
            {/* Grid Container */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Input Settings & File upload */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Preset Selection & Dimensions */}
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    <h2 className="font-extrabold text-base sm:text-lg">1. रीसाइज़िंग सेटिंग्स चुनें / Choose Target Specs</h2>
                  </div>

                  {/* Preset Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                      नौकरी / परीक्षा फॉर्मPreset:
                    </label>
                    <select
                      value={selectedPresetKey}
                      onChange={(e) => setSelectedPresetKey(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm sm:text-base font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition"
                    >
                      {Object.entries(PRESETS).map(([key, preset]) => (
                        <option key={key} value={key} className="font-bold text-slate-800">
                          {preset.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-blue-600 font-bold bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 mt-1">
                      💡 {activePreset.hindiDesc}
                    </p>
                  </div>

                  {/* Manual Override controls (Always visible, but bound to presets unless custom is selected) */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Width (px)</label>
                      <input
                        type="number"
                        value={customWidth}
                        disabled={selectedPresetKey !== 'custom-photo'}
                        onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-center disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Height (px)</label>
                      <input
                        type="number"
                        value={customHeight}
                        disabled={selectedPresetKey !== 'custom-photo'}
                        onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-center disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">Max Size (KB)</label>
                      <input
                        type="number"
                        value={customMaxKB}
                        disabled={selectedPresetKey !== 'custom-photo'}
                        onChange={(e) => setCustomMaxKB(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-center disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload & Workspace Area */}
                <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-md space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <h2 className="font-extrabold text-base sm:text-lg">2. फोटो अपलोड करें / Upload File</h2>
                    </div>
                    {imageFile && (
                      <button
                        onClick={resetForm}
                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        Reset / रीसेट करें
                      </button>
                    )}
                  </div>

                  {!imageFile ? (
                    /* Drag & Drop Target Box */
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-3 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 rounded-2xl py-12 px-6 text-center cursor-pointer transition-all duration-300 group flex flex-col items-center justify-center space-y-4"
                    >
                      <div className="bg-white p-4 rounded-full shadow-md text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition duration-300">
                        <Upload className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 text-sm sm:text-base">
                          यहाँ फोटो खींचे या क्लिक करके चुनें
                        </p>
                        <p className="text-xs text-slate-500">
                          (Drag & drop your file here, or click to browse)
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium pt-1">
                          Supported formats: JPG, JPEG, PNG
                        </p>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Selected Image Details */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <img src={originalUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate max-w-[200px] sm:max-w-xs">{imageFile.name}</p>
                            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Original Size: {formatSize(originalSize)}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded">JPEG / PNG</span>
                      </div>

                      {/* Action Trigger Button */}
                      <button
                        onClick={processImage}
                        disabled={isProcessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold py-3.5 px-6 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>रीसाइज़ किया जा रहा है / Compressing...</span>
                          </>
                        ) : (
                          <>
                            <Minimize className="w-5 h-5" />
                            <span>अभी रीसाइज़ करें / Resize Now!</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Resizing Results Section */}
                {resizedUrl && (
                  <div 
                    id="resizer-results" 
                    className="bg-gradient-to-br from-white to-blue-50/10 rounded-2xl p-5 md:p-6 border border-emerald-200 shadow-lg space-y-6 animate-fade-in scroll-mt-20"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <h2 className="font-extrabold text-base sm:text-lg text-slate-800">3. आपका आउटपुट तैयार है! / Resized Result</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                      {/* Image Preview Box */}
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div 
                          className="bg-white rounded-xl p-3 border-2 border-slate-200 shadow-inner overflow-hidden flex items-center justify-center bg-checkered-pattern"
                          style={{ maxWidth: '100%', maxHeight: '280px' }}
                        >
                          <img 
                            src={resizedUrl} 
                            alt="Resized preview" 
                            className="max-h-[220px] object-contain shadow border border-slate-100 rounded" 
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Output Preview</span>
                      </div>

                      {/* Statistics & Download */}
                      <div className="space-y-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3.5">
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-bold text-slate-500">Original Size:</span>
                            <span className="font-mono font-bold text-slate-700">{formatSize(originalSize)}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-bold text-slate-500">New Resized Size:</span>
                            <span className="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-sm">
                              {formatSize(resizedSize)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm border-t border-slate-100 pt-2.5">
                            <span className="font-bold text-slate-500">Target KB Specs:</span>
                            <span className="font-mono font-bold text-blue-600">Under {customMaxKB} KB</span>
                          </div>
                          <div className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="font-bold text-slate-500">Output Dimensions:</span>
                            <span className="font-mono font-bold text-slate-700">{customWidth}x{customHeight} px</span>
                          </div>
                        </div>

                        <button
                          onClick={downloadResized}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base animate-bounce"
                        >
                          <Download className="w-5 h-5" />
                          <span>फोटो डाउनलोड करें / Download Now!</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Super high-conversion Lead Generation Panel */}
              <div className="space-y-6">
                
                {/* 100% Safe Form Fill CTA Banner (The core Growth Hack) */}
                <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border-2 border-yellow-400/60 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                  
                  <div className="space-y-4">
                    <span className="bg-yellow-400 text-indigo-950 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wide inline-flex items-center gap-1 self-start">
                      <AlertTriangle className="w-3.5 h-3.5" /> Important Warning!
                    </span>
                    
                    <h3 className="text-xl sm:text-2xl font-black leading-tight">
                      गलत फॉर्म भरने से एडमिट कार्ड रिजेक्ट होने का खतरा!
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                      हर साल हजारों छात्र अपनी छोटी सी गलती के कारण परीक्षा में बैठने से वंचित रह जाते हैं। फोटो बैकग्राउंड, सिग्नेचर साइज या नाम स्पेलिंग की गलती भारी पड़ सकती है।
                    </p>
                    
                    <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 space-y-2.5">
                      <p className="text-xs font-bold text-yellow-300 flex items-start gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>100% त्रुटि-मुक्त फॉर्म भरने की गारंटी!</span>
                      </p>
                      <p className="text-xs font-bold text-yellow-300 flex items-start gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>केवल ₹50 सेवा शुल्क में त्वरित सर्विस!</span>
                      </p>
                      <p className="text-xs font-bold text-yellow-300 flex items-start gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>दुकान पर आने की जरूरत नहीं, व्हाट्सएप से फॉर्म भरें!</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <a
                      href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra,%20I%20want%20to%20apply%20for%20a%20government%20job%20form."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black py-3 px-4 rounded-xl text-center shadow-lg transition duration-200 active:scale-95 block text-xs sm:text-sm"
                    >
                      💬 व्हाट्सएप से अभी फॉर्म भरवाएं! (Send Details on WhatsApp)
                    </a>
                    
                    <a
                      href="tel:9193898182"
                      className="bg-white/10 hover:bg-white/20 text-white font-extrabold py-3 px-4 rounded-xl text-center border border-white/30 transition duration-200 active:scale-95 block text-xs sm:text-sm"
                    >
                      📞 एक्सपर्ट को कॉल करें: 9193898182
                    </a>
                  </div>
                </div>

                {/* FAQ or Tips list */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <HelpCircle className="w-4.5 h-4.5 text-blue-600" />
                    <h3 className="font-extrabold text-sm sm:text-base">Resizing Tips / ध्यान रखने योग्य बातें</h3>
                  </div>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-650 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>बैकग्राउंड:</strong> अधिकांश सरकारी फॉर्मों में हल्के नीले या सफेद बैकग्राउंड वाली रंगीन फोटो की ही मांग की जाती है।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>हस्ताक्षर (Sign):</strong> हमेशा सफेद सादे कागज पर काली स्याही के पेन (Black Ink Pen) से हस्ताक्षर करके ही स्कैन करें।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span><strong>एडमिट कार्ड:</strong> आपका एडमिट कार्ड रद्द न हो, इसलिए धुंधली या पुरानी फोटो कभी भी अपलोड न करें।</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Referral / Shop Visit Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-100 inline-block">
                  📍 Visit Our Official CSC Shop
                </span>
                <h4 className="text-lg sm:text-xl font-extrabold text-slate-800">
                  इटावा जिले के सर्वश्रेष्ठ जन सेवा केंद्र पर आपका स्वागत है!
                </h4>
                <p className="text-xs sm:text-sm text-slate-500">
                  <strong>पता:</strong> मंडी तिराहा, बिधुना रोड, भरथना, इटावा (UP 206241). हमारे यहाँ सभी प्रकार के फॉर्म, प्रमाण पत्र व आईटी सेवाएं उपलब्ध हैं।
                </p>
              </div>
              <div className="flex flex-wrap gap-3 flex-shrink-0 justify-center">
                <button
                  onClick={handleChatOpen}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-3 rounded-xl transition duration-200 active:scale-95 shadow-md flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>लाइव चैट करें / Start Chat</span>
                </button>
                <a
                  href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra,%20I%2520need%2520help%2520with%2520online%2520services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-750 text-white font-extrabold px-5 py-3 rounded-xl transition duration-200 active:scale-95 shadow-md flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>व्हाट्सएप / WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Global CSS for checkered transparency background */}
        <style jsx global>{`
          .bg-checkered-pattern {
            background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                              linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                              linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                              linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
            background-size: 16px 16px;
            background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}
