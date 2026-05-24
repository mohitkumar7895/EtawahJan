'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import NextImage from 'next/image';
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
  Eraser,
  Brush,
  Settings,
  Trash2,
  Pipette,
  Layers,
  Move,
  Maximize,
  Undo
} from 'lucide-react';
import Link from 'next/link';
import {
  detectBackgroundColorFromCanvas,
  applyAlphaChannelAsMask,
  loadImageFromBlobUrl,
} from '@/lib/backgroundRemoval';
import { removeBackgroundViaRemoveBg } from '@/lib/removeBgClient';

interface ColorPreset {
  name: string;
  hindiName: string;
  value: string;
  rgb: [number, number, number];
  isOfficial?: boolean;
}

const OFFICIAL_COLORS: ColorPreset[] = [
  { name: 'Official White', hindiName: 'Official White (SSC, Police, NEET)', value: '#FFFFFF', rgb: [255, 255, 255], isOfficial: true },
  { name: 'Light Grey', hindiName: 'Light Grey (UPSSSC)', value: '#F2F2F2', rgb: [242, 242, 242], isOfficial: true },
  { name: 'Passport Sky Blue', hindiName: 'Passport Sky Blue (Scholarship)', value: '#D8E6F8', rgb: [216, 230, 248], isOfficial: true },
  { name: 'Standard Blue', hindiName: 'Standard Blue', value: '#3B82F6', rgb: [59, 130, 246] },
  { name: 'Royal Blue', hindiName: 'Royal Blue (Corporate / Resume)', value: '#0F2C59', rgb: [15, 44, 89] },
];

const GRADIENTS = [
  { name: 'Sunset Glow', value: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)' },
  { name: 'Ocean Breeze', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
  { name: 'Sleek Dark', value: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)' },
  { name: 'Emerald Magic', value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
  { name: 'Sweet Purple', value: 'linear-gradient(135deg, #da22ff 0%, #9733ee 100%)' }
];

const COMMON_CHROMA_KEY_PRESETS = [
  { name: 'Blue Screen', rgb: [59, 130, 246], hex: '#3B82F6', desc: 'Blue Backdrop' },
  { name: 'Green Screen', rgb: [34, 197, 94], hex: '#22C55E', desc: 'Green Backdrop' },
  { name: 'White Wall', rgb: [240, 240, 240], hex: '#F0F0F0', desc: 'White Backdrop' },
  { name: 'Red Screen', rgb: [239, 68, 68], hex: '#EF4444', desc: 'Red Backdrop' }
];

export default function ImageBackgroundChangerPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAutoRemoving, setIsAutoRemoving] = useState<boolean>(false);
  const [autoRemoveProgress, setAutoRemoveProgress] = useState<string>('');
  const [removalMode, setRemovalMode] = useState<'auto-chroma' | 'removebg' | 'none'>('none');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'auto-remove' | 'manual-refine' | 'background' | 'adjustments' | 'download'>('background');

  // Chroma Key Settings
  const [keyColor, setKeyColor] = useState<[number, number, number] | null>(null);
  const [tolerance, setTolerance] = useState<number>(45);
  const [feather, setFeather] = useState<number>(5);
  const [isEyeDropperActive, setIsEyeDropperActive] = useState<boolean>(false);
  const [smartShield, setSmartShield] = useState<boolean>(true);
  const [clickSeed, setClickSeed] = useState<{ x: number; y: number } | null>(null);

  // Brush settings
  const [toolMode, setToolMode] = useState<'move-subject' | 'brush-erase' | 'brush-restore'>('move-subject');
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushHardness, setBrushHardness] = useState<number>(50);

  // Background options
  const [bgColorType, setBgColorType] = useState<'color' | 'gradient' | 'image' | 'transparent'>('color');
  const [selectedBgColor, setSelectedBgColor] = useState<string>('#FFFFFF');
  const [selectedGradient, setSelectedGradient] = useState<string>(GRADIENTS[0].value);
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string>('');

  // Subject Position Adjustments
  const [subjectScale, setSubjectScale] = useState<number>(1.0);
  const [subjectX, setSubjectX] = useState<number>(0);
  const [subjectY, setSubjectY] = useState<number>(0);
  const [subjectRotate, setSubjectRotate] = useState<number>(0);

  // Subject Filters & Effects
  const [subjectBrightness, setSubjectBrightness] = useState<number>(100);
  const [subjectContrast, setSubjectContrast] = useState<number>(100);
  const [subjectSaturation, setSubjectSaturation] = useState<number>(100);
  const [edgeBlur, setEdgeBlur] = useState<number>(0);

  // Output options
  const [outputPreset, setOutputPreset] = useState<'original' | 'passport' | 'ssc-size' | 'square'>('passport');
  const [customWidth, setCustomWidth] = useState<number>(350);
  const [customHeight, setCustomHeight] = useState<number>(450);
  const [targetMaxKB, setTargetMaxKB] = useState<number>(50);
  
  // Rectangular frame border
  const [frameBorderSize, setFrameBorderSize] = useState<number>(1);
  const [frameBorderColor, setFrameBorderColor] = useState<string>('#CCCCCC');

  // Final Output
  const [resizedUrl, setResizedUrl] = useState<string>('');
  const [resizedSize, setResizedSize] = useState<number>(0);

  // Ref hooks
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const workspaceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const bgImageElementRef = useRef<HTMLImageElement | null>(null);

  // Offscreen layer canvases
  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const restoreCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const uploadedUrlRef = useRef<string | null>(null);

  // Setup dimensions based on preset
  useEffect(() => {
    if (outputPreset === 'passport') {
      setCustomWidth(350);
      setCustomHeight(450);
    } else if (outputPreset === 'ssc-size') {
      setCustomWidth(350);
      setCustomHeight(450);
    } else if (outputPreset === 'square') {
      setCustomWidth(500);
      setCustomHeight(500);
    } else if (outputPreset === 'original' && originalWidth && originalHeight) {
      setCustomWidth(originalWidth);
      setCustomHeight(originalHeight);
    }
  }, [outputPreset, originalWidth, originalHeight]);

  // 3. Render Combined Composite Workspace Canvas
  const renderCompositeCanvas = useCallback(() => {
    const workspace = workspaceCanvasRef.current;
    if (!workspace || !originalImageRef.current || !srcCanvasRef.current || !maskCanvasRef.current || !eraseCanvasRef.current || !restoreCanvasRef.current) return;

    const ctx = workspace.getContext('2d');
    if (!ctx) return;

    const imgWidth = originalImageRef.current.width;
    const imgHeight = originalImageRef.current.height;

    workspace.width = customWidth;
    workspace.height = customHeight;

    ctx.clearRect(0, 0, customWidth, customHeight);

    if (bgColorType === 'color') {
      ctx.fillStyle = selectedBgColor;
      ctx.fillRect(0, 0, customWidth, customHeight);
    } else if (bgColorType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, customWidth, customHeight);
      if (selectedGradient.includes('#FF512F')) {
        grad.addColorStop(0, '#FF512F');
        grad.addColorStop(1, '#DD2476');
      } else if (selectedGradient.includes('#2193b0')) {
        grad.addColorStop(0, '#2193b0');
        grad.addColorStop(1, '#6dd5ed');
      } else if (selectedGradient.includes('#1f1c2c')) {
        grad.addColorStop(0, '#1f1c2c');
        grad.addColorStop(1, '#928dab');
      } else if (selectedGradient.includes('#11998e')) {
        grad.addColorStop(0, '#11998e');
        grad.addColorStop(1, '#38ef7d');
      } else {
        grad.addColorStop(0, '#da22ff');
        grad.addColorStop(1, '#9733ee');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, customWidth, customHeight);
    } else if (bgColorType === 'image' && bgImageElementRef.current) {
      const bgImg = bgImageElementRef.current;
      const scale = Math.max(customWidth / bgImg.width, customHeight / bgImg.height);
      const x = (customWidth - bgImg.width * scale) / 2;
      const y = (customHeight - bgImg.height * scale) / 2;
      ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
    }

    const tempMaskCanvas = document.createElement('canvas');
    tempMaskCanvas.width = imgWidth;
    tempMaskCanvas.height = imgHeight;
    const tempMaskCtx = tempMaskCanvas.getContext('2d');
    if (tempMaskCtx) {
      tempMaskCtx.drawImage(maskCanvasRef.current, 0, 0);
      tempMaskCtx.globalCompositeOperation = 'destination-out';
      tempMaskCtx.drawImage(eraseCanvasRef.current, 0, 0);
      tempMaskCtx.globalCompositeOperation = 'source-over';
      tempMaskCtx.drawImage(restoreCanvasRef.current, 0, 0);
    }

    const tempSubjectCanvas = document.createElement('canvas');
    tempSubjectCanvas.width = imgWidth;
    tempSubjectCanvas.height = imgHeight;
    const tempSubCtx = tempSubjectCanvas.getContext('2d');
    if (tempSubCtx) {
      tempSubCtx.filter = `brightness(${subjectBrightness}%) contrast(${subjectContrast}%) saturate(${subjectSaturation}%)`;
      tempSubCtx.drawImage(srcCanvasRef.current, 0, 0);
      tempSubCtx.filter = 'none';
      tempSubCtx.globalCompositeOperation = 'destination-in';
      tempSubCtx.drawImage(tempMaskCanvas, 0, 0);
      tempSubCtx.globalCompositeOperation = 'source-over';

      if (edgeBlur > 0) {
        tempSubCtx.filter = `blur(${edgeBlur}px)`;
        const tempBlurCanvas = document.createElement('canvas');
        tempBlurCanvas.width = imgWidth;
        tempBlurCanvas.height = imgHeight;
        const tempBlurCtx = tempBlurCanvas.getContext('2d');
        if (tempBlurCtx) {
          tempBlurCtx.drawImage(tempSubjectCanvas, 0, 0);
        }
        tempSubCtx.clearRect(0, 0, imgWidth, imgHeight);
        tempSubCtx.drawImage(tempBlurCanvas, 0, 0);
        tempSubCtx.filter = 'none';
      }
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.translate(customWidth / 2 + subjectX, customHeight / 2 + subjectY);
    ctx.rotate((subjectRotate * Math.PI) / 180);
    ctx.scale(subjectScale, subjectScale);
    ctx.drawImage(tempSubjectCanvas, -imgWidth / 2, -imgHeight / 2);
    ctx.restore();

    if (frameBorderSize > 0) {
      ctx.strokeStyle = frameBorderColor;
      ctx.lineWidth = frameBorderSize;
      ctx.strokeRect(
        frameBorderSize / 2,
        frameBorderSize / 2,
        customWidth - frameBorderSize,
        customHeight - frameBorderSize
      );
    }
  }, [
    bgColorType,
    customWidth,
    customHeight,
    edgeBlur,
    frameBorderColor,
    frameBorderSize,
    selectedBgColor,
    selectedGradient,
    subjectBrightness,
    subjectContrast,
    subjectRotate,
    subjectSaturation,
    subjectScale,
    subjectX,
    subjectY,
  ]);

  // 2. Perform Chroma Keying Pixel Loop
  const updateChromaKeyMask = useCallback((options?: {
    mode?: 'auto-chroma' | 'removebg' | 'none';
    keyColorOverride?: [number, number, number] | null;
  }) => {
    const effectiveMode = options?.mode ?? removalMode;
    const effectiveKeyColor = options?.keyColorOverride !== undefined ? options.keyColorOverride : keyColor;

    const srcCanvas = srcCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!srcCanvas || !maskCanvas) return;

    const width = srcCanvas.width;
    const height = srcCanvas.height;
    const srcCtx = srcCanvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!srcCtx || !maskCtx) return;

    const srcImgData = srcCtx.getImageData(0, 0, width, height);
    const maskImgData = maskCtx.createImageData(width, height);

    const srcData = srcImgData.data;
    const maskData = maskImgData.data;

    if (!effectiveKeyColor) {
      if (effectiveMode === 'removebg') {
        applyAlphaChannelAsMask(srcData, maskData);
      } else {
        // No background key selected - solid opaque mask
        for (let i = 0; i < srcData.length; i += 4) {
          maskData[i] = 255;
          maskData[i + 1] = 255;
          maskData[i + 2] = 255;
          maskData[i + 3] = 255;
        }
      }
    } else {
      const [keyR, keyG, keyB] = effectiveKeyColor;
      const maxDist = tolerance * 2.5; // Map tolerance 0-100 to standard range
      const featherWidth = feather * 1.5;

      if (smartShield) {
        // BFS / Flood fill starting from all 4 borders & optional click seed
        const visited = new Uint8Array(width * height);
        const queue = new Int32Array(width * height);
        let head = 0;
        let tail = 0;

        // Seed boundary pixels
        // Top and bottom borders
        for (let x = 0; x < width; x++) {
          // Top row
          const idxTop = x;
          const r1 = srcData[idxTop * 4];
          const g1 = srcData[idxTop * 4 + 1];
          const b1 = srcData[idxTop * 4 + 2];
          const d1 = Math.sqrt((r1 - keyR) ** 2 + (g1 - keyG) ** 2 + (b1 - keyB) ** 2);
          if (d1 < maxDist) {
            queue[tail++] = idxTop;
            visited[idxTop] = 1; // 1 = background/visited
          }

          // Bottom row
          const idxBot = (height - 1) * width + x;
          const r2 = srcData[idxBot * 4];
          const g2 = srcData[idxBot * 4 + 1];
          const b2 = srcData[idxBot * 4 + 2];
          const d2 = Math.sqrt((r2 - keyR) ** 2 + (g2 - keyG) ** 2 + (b2 - keyB) ** 2);
          if (d2 < maxDist) {
            queue[tail++] = idxBot;
            visited[idxBot] = 1;
          }
        }

        // Left and right borders (excluding corners which are checked in previous loop)
        for (let y = 1; y < height - 1; y++) {
          // Left column
          const idxLeft = y * width;
          const r1 = srcData[idxLeft * 4];
          const g1 = srcData[idxLeft * 4 + 1];
          const b1 = srcData[idxLeft * 4 + 2];
          const d1 = Math.sqrt((r1 - keyR) ** 2 + (g1 - keyG) ** 2 + (b1 - keyB) ** 2);
          if (d1 < maxDist) {
            queue[tail++] = idxLeft;
            visited[idxLeft] = 1;
          }

          // Right column
          const idxRight = y * width + (width - 1);
          const r2 = srcData[idxRight * 4];
          const g2 = srcData[idxRight * 4 + 1];
          const b2 = srcData[idxRight * 4 + 2];
          const d2 = Math.sqrt((r2 - keyR) ** 2 + (g2 - keyG) ** 2 + (b2 - keyB) ** 2);
          if (d2 < maxDist) {
            queue[tail++] = idxRight;
            visited[idxRight] = 1;
          }
        }

        // If there's an explicit click seed, seed it too
        if (clickSeed) {
          const idxClick = clickSeed.y * width + clickSeed.x;
          if (idxClick >= 0 && idxClick < width * height && visited[idxClick] === 0) {
            const r = srcData[idxClick * 4];
            const g = srcData[idxClick * 4 + 1];
            const b = srcData[idxClick * 4 + 2];
            const d = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
            if (d < maxDist) {
              queue[tail++] = idxClick;
              visited[idxClick] = 1;
            }
          }
        }

        // Expand BFS
        while (head < tail) {
          const idx = queue[head++];
          const cx = idx % width;
          const cy = (idx - cx) / width;

          // Check 4-way neighbors
          if (cy > 0) { // Up
            const nidx = (cy - 1) * width + cx;
            if (visited[nidx] === 0) {
              const r = srcData[nidx * 4];
              const g = srcData[nidx * 4 + 1];
              const b = srcData[nidx * 4 + 2];
              const d = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
              if (d < maxDist + featherWidth) {
                queue[tail++] = nidx;
                visited[nidx] = 1;
              } else {
                visited[nidx] = 2; // Visited boundary
              }
            }
          }
          if (cy < height - 1) { // Down
            const nidx = (cy + 1) * width + cx;
            if (visited[nidx] === 0) {
              const r = srcData[nidx * 4];
              const g = srcData[nidx * 4 + 1];
              const b = srcData[nidx * 4 + 2];
              const d = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
              if (d < maxDist + featherWidth) {
                queue[tail++] = nidx;
                visited[nidx] = 1;
              } else {
                visited[nidx] = 2;
              }
            }
          }
          if (cx > 0) { // Left
            const nidx = cy * width + (cx - 1);
            if (visited[nidx] === 0) {
              const r = srcData[nidx * 4];
              const g = srcData[nidx * 4 + 1];
              const b = srcData[nidx * 4 + 2];
              const d = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
              if (d < maxDist + featherWidth) {
                queue[tail++] = nidx;
                visited[nidx] = 1;
              } else {
                visited[nidx] = 2;
              }
            }
          }
          if (cx < width - 1) { // Right
            const nidx = cy * width + (cx + 1);
            if (visited[nidx] === 0) {
              const r = srcData[nidx * 4];
              const g = srcData[nidx * 4 + 1];
              const b = srcData[nidx * 4 + 2];
              const d = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);
              if (d < maxDist + featherWidth) {
                queue[tail++] = nidx;
                visited[nidx] = 1;
              } else {
                visited[nidx] = 2;
              }
            }
          }
        }

        // Apply alpha mask based on BFS results
        for (let idx = 0; idx < width * height; idx++) {
          const i = idx * 4;
          let alpha = 255;
          if (visited[idx] === 1) {
            const r = srcData[i];
            const g = srcData[i + 1];
            const b = srcData[i + 2];
            const dist = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);

            if (dist < maxDist - featherWidth) {
              alpha = 0; // Cutout fully
            } else if (dist > maxDist + featherWidth) {
              alpha = 255; // Keep fully
            } else {
              const t = (dist - (maxDist - featherWidth)) / (featherWidth * 2 || 1);
              alpha = Math.round(t * 255);
            }
          }
          maskData[i] = 255;
          maskData[i + 1] = 255;
          maskData[i + 2] = 255;
          maskData[i + 3] = alpha;
        }

      } else {
        // Global chroma key (original behavior)
        for (let i = 0; i < srcData.length; i += 4) {
          const r = srcData[i];
          const g = srcData[i + 1];
          const b = srcData[i + 2];
          const dist = Math.sqrt((r - keyR) ** 2 + (g - keyG) ** 2 + (b - keyB) ** 2);

          let alpha = 255;
          if (dist < maxDist - featherWidth) {
            alpha = 0;
          } else if (dist > maxDist + featherWidth) {
            alpha = 255;
          } else {
            const t = (dist - (maxDist - featherWidth)) / (featherWidth * 2 || 1);
            alpha = Math.round(t * 255);
          }

          maskData[i] = 255;
          maskData[i + 1] = 255;
          maskData[i + 2] = 255;
          maskData[i + 3] = alpha;
        }
      }
    }

    maskCtx.putImageData(maskImgData, 0, 0);
    renderCompositeCanvas();
  }, [clickSeed, feather, keyColor, removalMode, renderCompositeCanvas, smartShield, tolerance]);

  const triggerRedraw = useCallback(() => {
    if (!originalUrl || !workspaceCanvasRef.current) return;
    renderCompositeCanvas();
  }, [originalUrl, renderCompositeCanvas]);

  useEffect(() => {
    if (bgImageFile) {
      const url = URL.createObjectURL(bgImageFile);
      setBgImageUrl(url);
      const img = new window.Image();
      img.onload = () => {
        bgImageElementRef.current = img;
        triggerRedraw();
      };
      img.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [bgImageFile, triggerRedraw]);

  useEffect(() => {
    if (!originalUrl || !srcCanvasRef.current || !maskCanvasRef.current) return;
    updateChromaKeyMask();
  }, [keyColor, tolerance, feather, originalUrl, smartShield, clickSeed, removalMode, updateChromaKeyMask]);

  useEffect(() => {
    triggerRedraw();
  }, [
    originalUrl,
    bgColorType,
    selectedBgColor,
    selectedGradient,
    bgImageUrl,
    subjectScale,
    subjectX,
    subjectY,
    subjectRotate,
    subjectBrightness,
    subjectContrast,
    subjectSaturation,
    edgeBlur,
    frameBorderSize,
    frameBorderColor,
    customWidth,
    customHeight,
    triggerRedraw,
  ]);

  const setupImageCanvases = (img: HTMLImageElement): HTMLCanvasElement => {
    originalImageRef.current = img;
    setOriginalWidth(img.width);
    setOriginalHeight(img.height);

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = img.width;
    srcCanvas.height = img.height;
    const srcCtx = srcCanvas.getContext('2d');
    if (srcCtx) {
      srcCtx.drawImage(img, 0, 0);
    }
    srcCanvasRef.current = srcCanvas;

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = img.width;
    maskCanvas.height = img.height;
    maskCanvasRef.current = maskCanvas;

    const eraseCanvas = document.createElement('canvas');
    eraseCanvas.width = img.width;
    eraseCanvas.height = img.height;
    const eraseCtx = eraseCanvas.getContext('2d');
    if (eraseCtx) {
      eraseCtx.clearRect(0, 0, img.width, img.height);
    }
    eraseCanvasRef.current = eraseCanvas;

    const restoreCanvas = document.createElement('canvas');
    restoreCanvas.width = img.width;
    restoreCanvas.height = img.height;
    const restoreCtx = restoreCanvas.getContext('2d');
    if (restoreCtx) {
      restoreCtx.clearRect(0, 0, img.width, img.height);
    }
    restoreCanvasRef.current = restoreCanvas;

    return srcCanvas;
  };

  const applyInstantBackgroundRemoval = (mode: 'auto-chroma' | 'removebg') => {
    setSmartShield(true);
    setSelectedBgColor('#FFFFFF');
    setBgColorType('color');
    setActiveTab('background');

    if (mode === 'removebg') {
      setRemovalMode('removebg');
      setKeyColor(null);
      return;
    }

    const srcCanvas = srcCanvasRef.current;
    if (!srcCanvas) return;

    const detected = detectBackgroundColorFromCanvas(srcCanvas);
    setRemovalMode('auto-chroma');
    setKeyColor(detected);
  };

  const processUploadedImage = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg(
        'कृपया केवल वैध इमेज फाइल (JPG, JPEG, PNG) अपलोड करें। / Please select a valid image.'
      );
      return;
    }

    setIsAutoRemoving(true);
    setAutoRemoveProgress('remove.bg se background remove ho raha hai...');
    setErrorMsg('');
    setResizedUrl('');
    setImageFile(file);
    setOriginalUrl('');

    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    }

    const runChromaFallback = async () => {
      setAutoRemoveProgress('Smart detect se background remove ho raha hai...');
      const objectUrl = URL.createObjectURL(file);
      const img = await loadImageFromBlobUrl(objectUrl);
      setupImageCanvases(img);
      applyInstantBackgroundRemoval('auto-chroma');
      uploadedUrlRef.current = objectUrl;
      setOriginalUrl(objectUrl);
    };

    try {
      const blob = await removeBackgroundViaRemoveBg(file, { format: 'png' });
      const processedUrl = URL.createObjectURL(blob);
      const img = await loadImageFromBlobUrl(processedUrl);
      setupImageCanvases(img);
      applyInstantBackgroundRemoval('removebg');
      uploadedUrlRef.current = processedUrl;
      setOriginalUrl(processedUrl);
    } catch (removeBgError) {
      console.warn('remove.bg failed, using local fallback:', removeBgError);
      try {
        await runChromaFallback();
      } catch {
        setErrorMsg(
          removeBgError instanceof Error
            ? removeBgError.message
            : 'Image processing failed. Please try another photo.'
        );
        setImageFile(null);
      }
    } finally {
      setIsAutoRemoving(false);
      setAutoRemoveProgress('');
    }
  }, []);

  useEffect(() => {
    if (!originalUrl || !srcCanvasRef.current || !maskCanvasRef.current) {
      return;
    }
    const frameId = requestAnimationFrame(() => {
      if (!workspaceCanvasRef.current) return;
      updateChromaKeyMask();
    });
    return () => cancelAnimationFrame(frameId);
  }, [originalUrl, updateChromaKeyMask]);

  // Convert Click Coordinates on Canvas to Original Image Coordinates for precise Brush Drawing
  const getTransformedCoordinates = (clientX: number, clientY: number) => {
    const workspace = workspaceCanvasRef.current;
    if (!workspace || !originalImageRef.current) return null;

    const rect = workspace.getBoundingClientRect();
    
    // Position clicked inside workspace canvas (0 to canvas width/height)
    const wx = ((clientX - rect.left) / rect.width) * workspace.width;
    const wy = ((clientY - rect.top) / rect.height) * workspace.height;

    const imgWidth = originalImageRef.current.width;
    const imgHeight = originalImageRef.current.height;

    // 1. Translate back from center and offsets
    const x = wx - (workspace.width / 2 + subjectX);
    const y = wy - (workspace.height / 2 + subjectY);

    // 2. Rotate back
    const rad = (-subjectRotate * Math.PI) / 180;
    const rx = x * Math.cos(rad) - y * Math.sin(rad);
    const ry = x * Math.sin(rad) + y * Math.cos(rad);

    // 3. Scale back
    const ix = rx / subjectScale;
    const iy = ry / subjectScale;

    // 4. Map back to 0-indexed image dimensions
    const finalX = ix + imgWidth / 2;
    const finalY = iy + imgHeight / 2;

    return { x: finalX, y: finalY };
  };

  // Handle Brush Drag Paint Operations
  const handleDrawingPaint = (clientX: number, clientY: number) => {
    if (toolMode === 'move-subject') return;

    const coords = getTransformedCoordinates(clientX, clientY);
    if (!coords) return;

    const eraseCanvas = eraseCanvasRef.current;
    const restoreCanvas = restoreCanvasRef.current;
    if (!eraseCanvas || !restoreCanvas) return;

    const eraseCtx = eraseCanvas.getContext('2d');
    const restoreCtx = restoreCanvas.getContext('2d');
    if (!eraseCtx || !restoreCtx) return;

    const currentPoint = coords;

    // Set brush line configurations
    const strokeWidth = brushSize / subjectScale;

    // Paint stroke
    if (toolMode === 'brush-erase') {
      // 1. Paint opaque black on erase canvas
      eraseCtx.lineJoin = 'round';
      eraseCtx.lineCap = 'round';
      eraseCtx.lineWidth = strokeWidth;
      eraseCtx.strokeStyle = '#000000';
      eraseCtx.globalCompositeOperation = 'source-over';
      eraseCtx.beginPath();
      eraseCtx.moveTo(lastPointRef.current ? lastPointRef.current.x : currentPoint.x, lastPointRef.current ? lastPointRef.current.y : currentPoint.y);
      eraseCtx.lineTo(currentPoint.x, currentPoint.y);
      eraseCtx.stroke();

      // 2. Erase from restore canvas so they do not conflict
      restoreCtx.lineJoin = 'round';
      restoreCtx.lineCap = 'round';
      restoreCtx.lineWidth = strokeWidth;
      restoreCtx.strokeStyle = '#000000';
      restoreCtx.globalCompositeOperation = 'destination-out';
      restoreCtx.beginPath();
      restoreCtx.moveTo(lastPointRef.current ? lastPointRef.current.x : currentPoint.x, lastPointRef.current ? lastPointRef.current.y : currentPoint.y);
      restoreCtx.lineTo(currentPoint.x, currentPoint.y);
      restoreCtx.stroke();
    } else if (toolMode === 'brush-restore') {
      // 1. Paint opaque white on restore canvas
      restoreCtx.lineJoin = 'round';
      restoreCtx.lineCap = 'round';
      restoreCtx.lineWidth = strokeWidth;
      restoreCtx.strokeStyle = '#ffffff';
      restoreCtx.globalCompositeOperation = 'source-over';
      restoreCtx.beginPath();
      restoreCtx.moveTo(lastPointRef.current ? lastPointRef.current.x : currentPoint.x, lastPointRef.current ? lastPointRef.current.y : currentPoint.y);
      restoreCtx.lineTo(currentPoint.x, currentPoint.y);
      restoreCtx.stroke();

      // 2. Erase from erase canvas so they do not conflict
      eraseCtx.lineJoin = 'round';
      eraseCtx.lineCap = 'round';
      eraseCtx.lineWidth = strokeWidth;
      eraseCtx.strokeStyle = '#000000';
      eraseCtx.globalCompositeOperation = 'destination-out';
      eraseCtx.beginPath();
      eraseCtx.moveTo(lastPointRef.current ? lastPointRef.current.x : currentPoint.x, lastPointRef.current ? lastPointRef.current.y : currentPoint.y);
      eraseCtx.lineTo(currentPoint.x, currentPoint.y);
      eraseCtx.stroke();
    }

    lastPointRef.current = currentPoint;
    renderCompositeCanvas();
  };

  // Mouse / Touch handlers for painting and moving
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (toolMode === 'move-subject') {
      setIsDrawing(true);
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    setIsDrawing(true);
    const coords = getTransformedCoordinates(e.clientX, e.clientY);
    if (coords) {
      lastPointRef.current = coords;
      handleDrawingPaint(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;

    if (toolMode === 'move-subject') {
      const dx = e.clientX - lastPointRef.current.x;
      const dy = e.clientY - lastPointRef.current.y;
      setSubjectX(prev => prev + dx);
      setSubjectY(prev => prev + dy);
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      renderCompositeCanvas();
      return;
    }

    handleDrawingPaint(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  // Touch support for Mobile users
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (toolMode === 'move-subject') {
      setIsDrawing(true);
      lastPointRef.current = { x: touch.clientX, y: touch.clientY };
      return;
    }

    setIsDrawing(true);
    const coords = getTransformedCoordinates(touch.clientX, touch.clientY);
    if (coords) {
      lastPointRef.current = coords;
      handleDrawingPaint(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];

    if (toolMode === 'move-subject') {
      const dx = touch.clientX - lastPointRef.current.x;
      const dy = touch.clientY - lastPointRef.current.y;
      setSubjectX(prev => prev + dx);
      setSubjectY(prev => prev + dy);
      lastPointRef.current = { x: touch.clientX, y: touch.clientY };
      renderCompositeCanvas();
      return;
    }

    handleDrawingPaint(touch.clientX, touch.clientY);
  };

  // Click on source preview to select chroma key background
  const handleSourcePreviewClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    
    // Scale coordinates to actual image dimensions
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);

    // Read pixel using a helper temp canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      setKeyColor([pixel[0], pixel[1], pixel[2]]);
      setClickSeed({ x, y });
    }
  };

  // HTML5 Native EyeDropper API
  const activateNativeEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      const eyeDropper = new (window as any).EyeDropper();
      try {
        const result = await eyeDropper.open();
        const hex = result.sRGBHex;
        
        // Parse hex to RGB
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        setKeyColor([r, g, b]);
      } catch (e) {
        console.error('EyeDropper closed or failed:', e);
      }
    } else {
      setErrorMsg('EyeDropper not supported in your browser. Please click directly on the photo to choose color.');
    }
  };

  // Clear manual brush strokes
  const handleClearBrushStrokes = () => {
    if (eraseCanvasRef.current && restoreCanvasRef.current && originalImageRef.current) {
      const w = originalImageRef.current.width;
      const h = originalImageRef.current.height;
      
      const eraseCtx = eraseCanvasRef.current.getContext('2d');
      const restoreCtx = restoreCanvasRef.current.getContext('2d');
      
      if (eraseCtx && restoreCtx) {
        eraseCtx.clearRect(0, 0, w, h);
        restoreCtx.clearRect(0, 0, w, h);
      }
      renderCompositeCanvas();
    }
  };

  // Upload Photo File Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      void processUploadedImage(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Background Image Handler
  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBgImageFile(file);
      setBgColorType('image');
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      void processUploadedImage(e.dataTransfer.files[0]);
    }
  };

  // Perform Final Compression & Save Image
  const handleGenerateAndDownload = () => {
    if (!workspaceCanvasRef.current) return;

    setIsProcessing(true);
    setErrorMsg('');

    const canvas = workspaceCanvasRef.current;
    const targetMaxBytes = targetMaxKB * 1024;
    let quality = 0.95;
    let currentBase64 = '';
    let currentSizeBytes = 0;
    let iterationCount = 0;

    // Iterative compression algorithm to meet KB limit
    do {
      currentBase64 = canvas.toDataURL('image/jpeg', quality);
      const base64Content = currentBase64.split(',')[1];
      currentSizeBytes = Math.round((base64Content.length * 3) / 4);
      quality -= 0.05;
      iterationCount++;
    } while (currentSizeBytes > targetMaxBytes && quality > 0.08 && iterationCount < 20);

    setResizedUrl(currentBase64);
    setResizedSize(currentSizeBytes);
    setIsProcessing(false);
    setShowSuccessToast(true);

    // Scroll to output details
    setTimeout(() => {
      const outputEl = document.getElementById('bg-changer-output');
      if (outputEl) {
        outputEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 5000);
  };

  const downloadFinalImage = () => {
    if (!resizedUrl) return;

    const link = document.createElement('a');
    const cleanName = imageFile ? imageFile.name.split('.')[0] : 'etawahjan';
    link.download = `etawahjan_bg_changed_${cleanName}.jpg`;
    link.href = resizedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setImageFile(null);
    setOriginalUrl('');
    if (uploadedUrlRef.current) {
      URL.revokeObjectURL(uploadedUrlRef.current);
      uploadedUrlRef.current = null;
    }
    setResizedUrl('');
    setResizedSize(0);
    setKeyColor(null);
    setClickSeed(null);
    setRemovalMode('none');
    setIsAutoRemoving(false);
    setAutoRemoveProgress('');
    setTolerance(45);
    setFeather(5);
    setSubjectX(0);
    setSubjectY(0);
    setSubjectScale(1.0);
    setSubjectRotate(0);
    setBgColorType('color');
    setSelectedBgColor('#FFFFFF');
    setSubjectBrightness(100);
    setSubjectContrast(100);
    setSubjectSaturation(100);
    setEdgeBlur(0);
    setFrameBorderSize(1);
    setFrameBorderColor('#CCCCCC');
    setErrorMsg('');
  };

  // Custom Cursor Style for Brush operations
  const getCanvasCursorStyle = () => {
    if (toolMode === 'move-subject') return 'grab';
    
    // Create an SVG cursor showing brush size circle
    const visualSize = Math.max(8, brushSize);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${visualSize}" height="${visualSize}" viewBox="0 0 ${visualSize} ${visualSize}">
        <circle cx="${visualSize / 2}" cy="${visualSize / 2}" r="${visualSize / 2 - 1}" fill="rgba(59, 130, 246, 0.25)" stroke="#2563EB" stroke-width="1.5"/>
      </svg>
    `;
    return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}') ${visualSize / 2} ${visualSize / 2}, crosshair`;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 text-slate-800">
        
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-4 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Jan Seva Kendra Premium Photo Editor
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3">
              Change Image Background Online Free
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Powered by remove.bg API — upload karte hi professional background remove
            </p>
          </div>
        </section>

        {/* Main Workspace Section */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-7xl">
            
            {errorMsg && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 rounded-xl p-4 mb-6 font-bold text-sm flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!originalUrl ? (
              /* UPLOAD SCREEN */
              <div className="max-w-3xl mx-auto">
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => !isAutoRemoving && fileInputRef.current?.click()}
                  className={`bg-white border-3 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl py-16 px-6 text-center transition-all duration-300 group flex flex-col items-center justify-center space-y-6 shadow-md hover:shadow-xl ${
                    isAutoRemoving ? 'opacity-80 pointer-events-none' : 'cursor-pointer'
                  }`}
                >
                  {isAutoRemoving ? (
                    <>
                      <div className="bg-blue-50 p-6 rounded-full text-blue-600 shadow-inner">
                        <RefreshCw className="w-10 h-10 animate-spin" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-extrabold text-slate-800 text-xl sm:text-2xl">
                          Background Remove ho raha hai...
                        </h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                          {autoRemoveProgress || 'Please wait, your photo is being processed.'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-blue-50 p-6 rounded-full text-blue-600 group-hover:scale-110 transition duration-300 shadow-inner">
                        <Upload className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <h2 className="font-extrabold text-slate-800 text-xl sm:text-2xl">
                          Upload Photo — Background Auto Change
                        </h2>
                        <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
                          Drag & drop ya click karein. remove.bg API se background turant remove hoga, phir White/Grey/Blue color choose karein.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                />

                {/* Info Guide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">Official Form Rules</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        UP Police, SSC aur NEET rules ke according background correct color me hona jaruri hai.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">100% Safe & Secure</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Aapka data fully secure hai. Sabhi photo editing local browser me completely offline process hoti hai.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-3 text-left">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">Fine Brush Tools</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Agar automatic edges clean na ho to manual fine brushes se borders ko 1-second me clean karein.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* EDITOR SCREEN */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                {isAutoRemoving && (
                  <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-sm font-bold text-slate-700">
                      {autoRemoveProgress || 'Background remove ho raha hai...'}
                    </p>
                  </div>
                )}
                
                {/* LEFT WORKSPACE PANEL: CONTROLS (5 Cols) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
                  
                  {/* Tab Navigation */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto scrollbar-thin">
                    <button
                      onClick={() => setActiveTab('auto-remove')}
                      className={`flex-1 py-4 px-3 text-xs font-black uppercase tracking-wider text-center border-b-2 whitespace-nowrap transition ${
                        activeTab === 'auto-remove'
                          ? 'border-blue-600 text-blue-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      ✨ Auto Remove
                    </button>
                    <button
                      onClick={() => setActiveTab('manual-refine')}
                      className={`flex-1 py-4 px-3 text-xs font-black uppercase tracking-wider text-center border-b-2 whitespace-nowrap transition ${
                        activeTab === 'manual-refine'
                          ? 'border-blue-600 text-blue-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      🖌️ Fine Brush
                    </button>
                    <button
                      onClick={() => setActiveTab('background')}
                      className={`flex-1 py-4 px-3 text-xs font-black uppercase tracking-wider text-center border-b-2 whitespace-nowrap transition ${
                        activeTab === 'background'
                          ? 'border-blue-600 text-blue-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      🌈 Background
                    </button>
                    <button
                      onClick={() => setActiveTab('adjustments')}
                      className={`flex-1 py-4 px-3 text-xs font-black uppercase tracking-wider text-center border-b-2 whitespace-nowrap transition ${
                        activeTab === 'adjustments'
                          ? 'border-blue-600 text-blue-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      ⚙️ Adjust
                    </button>
                    <button
                      onClick={() => setActiveTab('download')}
                      className={`flex-1 py-4 px-3 text-xs font-black uppercase tracking-wider text-center border-b-2 whitespace-nowrap transition ${
                        activeTab === 'download'
                          ? 'border-blue-600 text-blue-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      💾 Download
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="p-6 space-y-6">
                    
                    {/* TAB 1: AUTO REMOVE */}
                    {activeTab === 'auto-remove' && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-800 text-base">1. Select Backdrop Color</h3>
                          <p className="text-xs text-slate-500">
                            Photo ka background color select karein jise remove karna hai.
                          </p>
                        </div>

                        {/* Chroma Key Color Picker Presets */}
                        <div className="grid grid-cols-2 gap-2">
                          {COMMON_CHROMA_KEY_PRESETS.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() => setKeyColor(preset.rgb as [number, number, number])}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left font-bold text-xs transition ${
                                keyColor && keyColor[0] === preset.rgb[0] && keyColor[1] === preset.rgb[1] && keyColor[2] === preset.rgb[2]
                                  ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                  : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span 
                                className="w-5 h-5 rounded-full border border-slate-300 block flex-shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              ></span>
                              <div className="min-w-0">
                                <p className="truncate text-[10px] uppercase text-slate-400 font-bold">{preset.name}</p>
                                <p className="truncate text-xs font-black">{preset.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Interactive Picker buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={activateNativeEyeDropper}
                            className="flex-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 border border-slate-250 shadow-sm"
                          >
                            <Pipette className="w-4 h-4" />
                            <span>आई-ड्रॉपर टूल (EyeDropper)</span>
                          </button>
                          {keyColor && (
                            <button
                              onClick={() => setKeyColor(null)}
                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-black px-4 rounded-xl text-xs transition active:scale-95"
                              title="Reset key selection"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Interactive Image click selection preview */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                          <h4 className="text-xs font-extrabold text-slate-650 text-center uppercase tracking-wide">
                            Or Click directly on the photo below:
                          </h4>
                          <div className="flex justify-center">
                            <NextImage
                              src={originalUrl}
                              alt="Source preview"
                              width={160}
                              height={160}
                              unoptimized
                              onClick={handleSourcePreviewClick}
                              className="max-h-40 max-w-full rounded-xl object-contain border border-slate-200 cursor-crosshair hover:shadow-md transition w-auto h-auto"
                              style={{ width: 'auto', height: 'auto' }}
                              title="Click directly on background color"
                            />
                          </div>
                        </div>

                        {/* Smart Shield Toggle Card */}
                        <div className="bg-emerald-50/70 border border-emerald-250 rounded-2xl p-4 space-y-2.5">
                          <label className="flex items-center justify-between cursor-pointer">
                            <div className="space-y-0.5 pr-2">
                              <span className="text-xs font-black text-emerald-850 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                                Smart Shirt & Face Shield
                              </span>
                              <p className="text-[10px] text-emerald-650 font-bold leading-normal">
                                Active hone par photo ke center me shirt aur face ka color secure rahega, taaki wo change na ho!
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={smartShield}
                              onChange={(e) => setSmartShield(e.target.checked)}
                              className="w-9 h-5 rounded-full bg-slate-300 checked:bg-emerald-650 appearance-none relative transition-all duration-300 cursor-pointer outline-none before:content-[''] before:w-4 before:h-4 before:rounded-full before:bg-white before:absolute before:top-0.5 before:left-0.5 checked:before:translate-x-4 before:transition-all shadow-inner border border-slate-400/25"
                            />
                          </label>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4 pt-2">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500 uppercase tracking-wide">Tolerance (Color Range)</span>
                              <span className="text-blue-600 font-mono">{tolerance}</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="120"
                              value={tolerance}
                              onChange={(e) => setTolerance(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500 uppercase tracking-wide">Feather Edge (Softness)</span>
                              <span className="text-blue-600 font-mono">{feather}</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="30"
                              value={feather}
                              onChange={(e) => setFeather(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: MANUAL REFINE */}
                    {activeTab === 'manual-refine' && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-800 text-base">2. Fine Tune Cutout with Brushes</h3>
                          <p className="text-xs text-slate-500">
                            Automatic cut out me koi mistake ho to Erase aur Restore brushes se change karein.
                          </p>
                        </div>

                        {/* Brush Selectors */}
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setToolMode('move-subject')}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 font-bold text-xs transition ${
                              toolMode === 'move-subject'
                                ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Move className="w-4 h-4" />
                            <span className="text-[10px] leading-tight">Move / Drag</span>
                          </button>
                          
                          <button
                            onClick={() => setToolMode('brush-erase')}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 font-bold text-xs transition ${
                              toolMode === 'brush-erase'
                                ? 'border-red-500 bg-red-50/50 text-red-700'
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Eraser className="w-4 h-4" />
                            <span className="text-[10px] leading-tight">Erase Brush</span>
                          </button>

                          <button
                            onClick={() => setToolMode('brush-restore')}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 font-bold text-xs transition ${
                              toolMode === 'brush-restore'
                                ? 'border-emerald-500 bg-emerald-50/50 text-emerald-700'
                                : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Brush className="w-4 h-4" />
                            <span className="text-[10px] leading-tight">Restore Brush</span>
                          </button>
                        </div>

                        {/* Custom Tips based on tool */}
                        <div className="text-[11px] font-bold p-3 rounded-xl border bg-slate-50 text-slate-650">
                          {toolMode === 'move-subject' && '💡 Tip: Subject ko mouse se drag karke resize ya position karein.'}
                          {toolMode === 'brush-erase' && '🔴 Erase Brush: Background ke bache hue areas ko erase karein.'}
                          {toolMode === 'brush-restore' && '🟢 Restore Brush: Accidentally kate hue parts ko drag karke restore karein.'}
                        </div>

                        {/* Brush controls */}
                        <div className="space-y-4 pt-1">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500 uppercase tracking-wide">Brush Size</span>
                              <span className="text-blue-600 font-mono">{brushSize}px</span>
                            </div>
                            <input
                              type="range"
                              min="5"
                              max="80"
                              value={brushSize}
                              onChange={(e) => setBrushSize(parseInt(e.target.value))}
                              disabled={toolMode === 'move-subject'}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500 uppercase tracking-wide">Brush Hardness</span>
                              <span className="text-blue-600 font-mono">{brushHardness}%</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={brushHardness}
                              onChange={(e) => setBrushHardness(parseInt(e.target.value))}
                              disabled={toolMode === 'move-subject'}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
                            />
                          </div>
                        </div>

                        {/* Clear all brush strokes */}
                        <button
                          onClick={handleClearBrushStrokes}
                          className="w-full bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-700 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Clear Brush Edits</span>
                        </button>
                      </div>
                    )}

                    {/* TAB 3: BACKGROUND */}
                    {activeTab === 'background' && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-800 text-base">3. Replace Background</h3>
                          <p className="text-xs text-slate-500">
                            Choose solid white, grey or blue colors for official forms.
                          </p>
                        </div>

                        {/* Background Type Selection */}
                        <div className="grid grid-cols-4 gap-1.5 border border-slate-200 rounded-xl p-1 bg-slate-50">
                          {(['color', 'gradient', 'image', 'transparent'] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => setBgColorType(type)}
                              className={`py-2 text-[10px] font-black uppercase rounded-lg tracking-wider transition ${
                                bgColorType === type
                                  ? 'bg-white text-blue-700 shadow-sm'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>

                        {/* Colors panel */}
                        {bgColorType === 'color' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                              {OFFICIAL_COLORS.map((preset) => (
                                <button
                                  key={preset.name}
                                  onClick={() => setSelectedBgColor(preset.value)}
                                  className={`flex items-center justify-between p-3 rounded-xl border-2 text-left font-bold text-xs transition ${
                                    selectedBgColor.toLowerCase() === preset.value.toLowerCase()
                                      ? 'border-blue-600 bg-blue-50/50'
                                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span 
                                      className="w-6 h-6 rounded-lg border border-slate-350 block flex-shrink-0"
                                      style={{ backgroundColor: preset.value }}
                                    ></span>
                                    <div>
                                      <p className="font-extrabold text-slate-800">{preset.name}</p>
                                      <p className="text-[10px] text-blue-600 font-bold">{preset.hindiName}</p>
                                    </div>
                                  </div>
                                  {preset.isOfficial && (
                                    <span className="bg-yellow-100 text-yellow-850 border border-yellow-200/50 text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wide">
                                      Official
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Color picker */}
                            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                              <span className="text-xs font-bold text-slate-650">Custom Color:</span>
                              <input
                                type="color"
                                value={selectedBgColor}
                                onChange={(e) => setSelectedBgColor(e.target.value)}
                                className="w-10 h-10 p-0 border border-slate-300 rounded cursor-pointer"
                              />
                            </div>
                          </div>
                        )}

                        {/* Gradient Panel */}
                        {bgColorType === 'gradient' && (
                          <div className="grid grid-cols-2 gap-3">
                            {GRADIENTS.map((grad) => (
                              <button
                                key={grad.name}
                                onClick={() => setSelectedGradient(grad.value)}
                                className={`h-20 rounded-xl border-2 p-3 font-bold text-xs flex flex-col justify-end text-left text-white shadow relative overflow-hidden transition-all duration-200 hover:scale-103 ${
                                  selectedGradient === grad.value ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-transparent'
                                }`}
                                style={{ background: grad.value }}
                              >
                                <span className="relative z-10 text-[10px] bg-slate-900/40 backdrop-blur-xs px-2 py-0.5 rounded">
                                  {grad.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Image Panel */}
                        {bgColorType === 'image' && (
                          <div className="space-y-4">
                            <div
                              onClick={() => bgFileInputRef.current?.click()}
                              className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/20 rounded-2xl py-8 px-4 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                            >
                              <Upload className="w-6 h-6 text-slate-400" />
                              <span className="text-xs font-bold text-slate-700">Upload Custom Background Image</span>
                              <input
                                type="file"
                                ref={bgFileInputRef}
                                onChange={handleBgImageChange}
                                accept="image/*"
                                className="hidden"
                              />
                            </div>

                            {bgImageUrl && (
                              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                <NextImage src={bgImageUrl} alt="Custom background preview" width={48} height={48} unoptimized className="w-12 h-12 rounded object-cover border border-slate-300" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-slate-800 truncate">{bgImageFile?.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">Background Custom Loaded</p>
                                </div>
                                <button
                                  onClick={() => {
                                    setBgImageFile(null);
                                    setBgImageUrl('');
                                    setBgColorType('color');
                                  }}
                                  className="text-red-500 hover:text-red-700 font-bold text-xs p-2 rounded"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Transparent Panel */}
                        {bgColorType === 'transparent' && (
                          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-4 text-xs leading-relaxed space-y-1">
                            <p className="font-extrabold flex items-center gap-1">
                              <span>✓ Transparent (PNG) Cutout Enabled</span>
                            </p>
                            <p className="text-slate-550 font-bold">
                              Background completely transparent ho chuka hai. Download karte time transparent formats use karein.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: SUBJECT ADJUSTMENTS */}
                    {activeTab === 'adjustments' && (
                      <div className="space-y-6">
                        
                        {/* Scale / Translate Panel */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5 border-b pb-2">
                            <Maximize className="w-4 h-4 text-blue-600" />
                            <h4 className="font-extrabold text-sm text-slate-850">Photo Size & Position</h4>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Zoom / Scale</span>
                              <span className="text-blue-600 font-mono">{(subjectScale * 100).toFixed(0)}%</span>
                            </div>
                            <input
                              type="range"
                              min="0.2"
                              max="3.0"
                              step="0.05"
                              value={subjectScale}
                              onChange={(e) => setSubjectScale(parseFloat(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Rotation</span>
                              <span className="text-blue-600 font-mono">{subjectRotate}°</span>
                            </div>
                            <input
                              type="range"
                              min="-180"
                              max="180"
                              value={subjectRotate}
                              onChange={(e) => setSubjectRotate(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">X Position Shift</label>
                              <input
                                type="number"
                                value={subjectX}
                                onChange={(e) => setSubjectX(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Y Position Shift</label>
                              <input
                                type="number"
                                value={subjectY}
                                onChange={(e) => setSubjectY(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Blending & Filters Panel */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5 border-b pb-2">
                            <Sliders className="w-4 h-4 text-blue-600" />
                            <h4 className="font-extrabold text-sm text-slate-850">Subject Lighting & Filters</h4>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Brightness</span>
                              <span className="text-blue-600 font-mono">{subjectBrightness}%</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={subjectBrightness}
                              onChange={(e) => setSubjectBrightness(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Contrast</span>
                              <span className="text-blue-600 font-mono">{subjectContrast}%</span>
                            </div>
                            <input
                              type="range"
                              min="50"
                              max="150"
                              value={subjectContrast}
                              onChange={(e) => setSubjectContrast(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs font-bold">
                              <span className="text-slate-500">Edge Softness</span>
                              <span className="text-blue-600 font-mono">{edgeBlur}px</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="8"
                              step="0.5"
                              value={edgeBlur}
                              onChange={(e) => setEdgeBlur(parseFloat(e.target.value))}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                          </div>
                        </div>

                        {/* Official Photo Border Frame */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-1.5 border-b pb-2">
                            <Settings className="w-4 h-4 text-blue-600" />
                            <h4 className="font-extrabold text-sm text-slate-850">Photo Frame Border</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-3 items-center">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Border Size (px)</label>
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={frameBorderSize}
                                onChange={(e) => setFrameBorderSize(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-center"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">Border Color</label>
                              <div className="flex items-center gap-1">
                                <input
                                  type="color"
                                  value={frameBorderColor}
                                  onChange={(e) => setFrameBorderColor(e.target.value)}
                                  className="w-8 h-8 p-0 border border-slate-300 rounded cursor-pointer"
                                />
                                <span className="font-mono text-[10px] font-bold">{frameBorderColor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: DOWNLOAD SPECS */}
                    {activeTab === 'download' && (
                      <div className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-slate-800 text-base">5. Output Formats & Size</h3>
                          <p className="text-xs text-slate-500">
                            Jis exam form me photo upload karni hai uske target size ke according choose karein.
                          </p>
                        </div>

                        {/* Output Presets */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                            Choose Preset Size:
                          </label>
                          <select
                            value={outputPreset}
                            onChange={(e: any) => setOutputPreset(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                          >
                            <option value="passport">Indian Passport Size (3.5x4.5 cm / 350x450 px)</option>
                            <option value="ssc-size">SSC/UP Police Exam Spec (350x450 px)</option>
                            <option value="square">Social Media Square (1:1 / 500x500 px)</option>
                            <option value="original">Original Aspect Ratio</option>
                          </select>
                        </div>

                        {/* Manual dimensions */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Width (px)</label>
                            <input
                              type="number"
                              value={customWidth}
                              disabled={outputPreset !== 'original'}
                              onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-center disabled:opacity-60"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase">Height (px)</label>
                            <input
                              type="number"
                              value={customHeight}
                              disabled={outputPreset !== 'original'}
                              onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-bold text-center disabled:opacity-60"
                            />
                          </div>
                        </div>

                        {/* Target KB */}
                        <div className="space-y-1 pt-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-500 uppercase tracking-wide">Max File Size</span>
                            <span className="text-blue-600 font-mono">Under {targetMaxKB} KB</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="200"
                            step="5"
                            value={targetMaxKB}
                            onChange={(e) => setTargetMaxKB(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <p className="text-[10px] text-blue-600 font-bold bg-blue-50/70 p-2 rounded-lg border border-blue-100 mt-1">
                            💡 Govt form ke liye photo size general rules ke according <strong>20KB se 50KB</strong> hona chahiye.
                          </p>
                        </div>

                        {/* Action buttons */}
                        <button
                          onClick={handleGenerateAndDownload}
                          disabled={isProcessing}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-4 px-6 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              <span>Process & Generate!</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT PANEL: INTERACTIVE EDITOR CANVAS WORKSPACE (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Visual workspace frame */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 md:p-8 flex flex-col items-center justify-between space-y-4">
                    
                    {/* Top Workspace Header */}
                    <div className="flex justify-between items-center w-full border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-black tracking-wide border px-2 py-0.5 rounded-full uppercase">
                          Live Canvas Workspace
                        </span>
                        {toolMode !== 'move-subject' && (
                          <span className="bg-red-100 text-red-800 text-[10px] font-black tracking-wide border px-2 py-0.5 rounded-full uppercase animate-pulse">
                            Brush Active
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={resetAll}
                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition"
                      >
                        Reset All
                      </button>
                    </div>

                    {/* Canvas Frame Wrapper */}
                    <div 
                      className="bg-checkered-pattern rounded-2xl border-2 border-slate-200 shadow-inner overflow-hidden flex items-center justify-center relative cursor-default"
                      style={{ 
                        width: '100%', 
                        maxWidth: '400px', 
                        height: '480px',
                        cursor: getCanvasCursorStyle()
                      }}
                    >
                      <canvas
                        ref={workspaceCanvasRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                        className="shadow-md border border-slate-300 max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Quick Background Swatches (remove.bg style) */}
                    <div className="w-full space-y-2 pt-2">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">
                        Quick Background Change
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {OFFICIAL_COLORS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setBgColorType('color');
                              setSelectedBgColor(preset.value);
                              setActiveTab('background');
                            }}
                            title={preset.name}
                            className={`w-9 h-9 rounded-full border-2 transition hover:scale-110 ${
                              selectedBgColor.toLowerCase() === preset.value.toLowerCase() && bgColorType === 'color'
                                ? 'border-blue-600 ring-2 ring-blue-300'
                                : 'border-slate-300'
                            }`}
                            style={{ backgroundColor: preset.value }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom Status Details */}
                    <div className="flex flex-wrap justify-between items-center gap-4 w-full text-xs text-slate-500 font-bold border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-blue-600" />
                        <span>Canvas Specs: {customWidth} x {customHeight} px</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded border">
                        <span className="text-[10px] text-slate-400">Engine:</span>
                        <span className="font-mono text-[10px] text-slate-700">
                          {removalMode === 'removebg' ? 'remove.bg API' : removalMode === 'auto-chroma' ? 'Smart Detect' : 'None'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded border">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border inline-block"
                          style={{ backgroundColor: keyColor ? `rgb(${keyColor.join(',')})` : '#CCCCCC' }}
                        ></span>
                        <span className="font-mono text-[10px] text-slate-700">{keyColor ? `rgb(${keyColor.join(',')})` : 'None'}</span>
                      </div>
                    </div>

                  </div>

                  {/* TAB 5 OUTPUT PREVIEW IF GENERATED */}
                  {resizedUrl && (
                    <div 
                      id="bg-changer-output"
                      className="bg-gradient-to-br from-white to-blue-50/10 rounded-3xl p-6 border-2 border-emerald-250 shadow-xl space-y-6 animate-fade-in scroll-mt-20"
                    >
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <h2 className="font-extrabold text-base sm:text-lg text-slate-800">
                          Congratulations! Your output is ready!
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                        {/* Output visual */}
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="bg-white rounded-xl p-3 border-2 border-slate-200 shadow-inner overflow-hidden flex items-center justify-center bg-checkered-pattern max-h-[300px] max-w-full">
                            <NextImage
                              src={resizedUrl}
                              alt="Resized output"
                              width={240}
                              height={300}
                              unoptimized
                              className="max-h-[240px] w-auto h-auto object-contain shadow border border-slate-100 rounded"
                              style={{ width: 'auto', height: 'auto' }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Final Output JPEG Preview</span>
                        </div>

                        {/* Specs & download CTA */}
                        <div className="space-y-4">
                          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 font-bold text-xs sm:text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Original Dimensions:</span>
                              <span className="text-slate-700 font-mono">{originalWidth}x{originalHeight} px</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Output Dimensions:</span>
                              <span className="text-slate-700 font-mono">{customWidth}x{customHeight} px</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                              <span className="text-slate-500">Target KB Setting:</span>
                              <span className="text-blue-600 font-mono">Under {targetMaxKB} KB</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500">Final File Size:</span>
                              <span className="font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-sm">
                                {(resizedSize / 1024).toFixed(1)} KB
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={downloadFinalImage}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2 text-sm sm:text-base animate-bounce"
                          >
                            <Download className="w-5 h-5" />
                            <span>Download Photo Now!</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Super High Conversion WhatsApp CTA Banner */}
                  <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-yellow-400/60 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl -mr-6 -mt-6"></div>
                    
                    <div className="space-y-4">
                      <span className="bg-yellow-400 text-indigo-950 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wide inline-flex items-center gap-1 self-start">
                        <AlertTriangle className="w-3.5 h-3.5 animate-pulse" /> Urgent Admission Alert!
                      </span>
                      
                      <h3 className="text-xl sm:text-2xl font-black leading-tight">
                        Exam Form Photo reject hone se bachayein!
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                        Galat background or low quality photo ke chalte form **reject** ho sakta hai. Risk na lein! Hamare experts se **sirf ₹50** me 100% correct online form fill karwayein.
                      </p>
                      
                      <div className="bg-white/10 rounded-xl p-3.5 border border-white/10 space-y-2.5">
                        <p className="text-xs font-bold text-yellow-300 flex items-start gap-1.5">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>WhatsApp par documents send karein aur relax ho jayein!</span>
                        </p>
                        <p className="text-xs font-bold text-yellow-300 flex items-start gap-1.5">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span>100% correct form filling & admit card generation ki guarantee!</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6">
                      <a
                        href="https://wa.me/917895094129?text=Hello%20Jan%20Seva%20Kendra,%20I%20want%20to%20apply%2520for%2520government%2520exam%2520form."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black py-3.5 px-4 rounded-xl text-center shadow-lg transition duration-200 active:scale-95 block text-xs sm:text-sm"
                      >
                        💬 Send Documents on WhatsApp (Apply Now)
                      </a>
                      
                      <a
                        href="tel:9193898182"
                        className="bg-white/10 hover:bg-white/20 text-white font-extrabold py-3 px-4 rounded-xl text-center border border-white/30 transition duration-200 active:scale-95 block text-xs sm:text-sm"
                      >
                        📞 Call Expert: 9193898182
                      </a>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        </section>

        {/* Global Styles */}
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
          .scrollbar-thin::-webkit-scrollbar {
            height: 4px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.15);
            border-radius: 4px;
          }
        `}</style>

      </div>
      <Footer />
    </>
  );
}
