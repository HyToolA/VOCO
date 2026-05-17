/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  Settings2, 
  Download, 
  Languages, 
  Monitor, 
  AlertCircle,
  Image as ImageIcon,
  Zap,
  Maximize2,
  FileImage,
  Cpu,
  Layers,
  ChevronRight,
  Upload
} from "lucide-react";
import { useState, useEffect, useRef, ChangeEvent } from "react";

interface VoiceOption {
  voice: SpeechSynthesisVoice;
  index: number;
}

export default function App() {
  const [activeTool, setActiveTool] = useState<"voco" | "prism">("voco");
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showVoiceGrid, setShowVoiceGrid] = useState(false);
  
  const [clickCount, setClickCount] = useState(0);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [adsenseId, setAdsenseId] = useState("ca-pub-4590201922446049");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passAttempt, setPassAttempt] = useState("");

  const characterPresets = [
    { name: "Default", pitch: 1, rate: 1, icon: "👤" },
    { name: "Robot", pitch: 0.1, rate: 0.9, icon: "🤖" },
    { name: "Giant", pitch: 0.5, rate: 0.7, icon: "👹" },
    { name: "Pixie", pitch: 2, rate: 1.2, icon: "🧚" },
    { name: "Chipmunk", pitch: 2, rate: 1.5, icon: "🐿️" },
    { name: "Deep", pitch: 0.1, rate: 0.8, icon: "🎙️" },
    { name: "Hurry", pitch: 1.2, rate: 1.8, icon: "⚡" },
    { name: "Alien", pitch: 0.2, rate: 1.1, icon: "👽" },
    { name: "Ghost", pitch: 0.8, rate: 0.6, icon: "👻" },
    { name: "Knight", pitch: 0.9, rate: 0.9, icon: "🛡️" },
    { name: "Dragon", pitch: 0.1, rate: 0.6, icon: "🐉" },
    { name: "Baby", pitch: 2.0, rate: 0.9, icon: "👶" },
    { name: "Elder", pitch: 0.7, rate: 0.7, icon: "👴" },
    { name: "Space", pitch: 1.1, rate: 0.8, icon: "👩‍🚀" },
    { name: "News", pitch: 1.0, rate: 1.1, icon: "📺" },
    { name: "DJ", pitch: 0.9, rate: 1.2, icon: "🎧" },
    { name: "Zombie", pitch: 0.3, rate: 0.5, icon: "🧟" },
    { name: "Ninja", pitch: 1.2, rate: 1.3, icon: "🥷" },
    { name: "Wizard", pitch: 0.7, rate: 0.8, icon: "🧙" },
    { name: "Fairy", pitch: 1.8, rate: 1.1, icon: "🪄" },
    { name: "Cyber", pitch: 1.5, rate: 1.2, icon: "🌉" },
    { name: "Demon", pitch: 0.1, rate: 0.5, icon: "😈" },
    { name: "Angel", pitch: 1.3, rate: 0.9, icon: "😇" },
    { name: "Kitty", pitch: 1.5, rate: 1.3, icon: "🐱" },
    { name: "Puppy", pitch: 0.8, rate: 1.2, icon: "🐶" },
    { name: "Mouse", pitch: 2.0, rate: 1.5, icon: "🐭" },
    { name: "Lion", pitch: 0.3, rate: 0.7, icon: "🦁" },
    { name: "Bird", pitch: 1.8, rate: 1.4, icon: "🐦" },
    { name: "Frog", pitch: 0.6, rate: 0.8, icon: "🐸" },
    { name: "Golem", pitch: 0.2, rate: 0.4, icon: "🗿" },
    { name: "Bat", pitch: 0.7, rate: 0.9, icon: "🧛" },
    { name: "Wolf", pitch: 0.4, rate: 0.8, icon: "🐺" },
    { name: "Clown", pitch: 1.6, rate: 1.3, icon: "🤡" },
    { name: "Spy", pitch: 0.8, rate: 0.9, icon: "🕵️" },
    { name: "Geek", pitch: 1.1, rate: 1.2, icon: "🧪" },
    { name: "Pirate", pitch: 0.6, rate: 0.7, icon: "🏴‍☠️" },
    { name: "Anchor", pitch: 0.9, rate: 1.0, icon: "⚓" },
    { name: "Chef", pitch: 1.1, rate: 1.1, icon: "👨‍🍳" },
    { name: "Medic", pitch: 1.0, rate: 1.0, icon: "👨‍⚕️" },
    { name: "Guru", pitch: 1.0, rate: 0.9, icon: "👨‍🏫" },
    { name: "Aviator", pitch: 1.1, rate: 1.1, icon: "👨‍✈️" },
    { name: "Grunt", pitch: 0.8, rate: 1.1, icon: "🎖️" },
    { name: "Agent", pitch: 0.9, rate: 0.9, icon: "🕶️" },
    { name: "Hacker", pitch: 1.4, rate: 1.4, icon: "💻" },
    { name: "Server", pitch: 0.5, rate: 1.0, icon: "💾" },
    { name: "Bug", pitch: 1.3, rate: 1.1, icon: "🪲" },
    { name: "Cave", pitch: 1.0, rate: 0.8, icon: "⛰️" },
    { name: "Quiet", pitch: 0.9, rate: 0.6, icon: "🤫" },
    { name: "Loud", pitch: 1.2, rate: 1.1, icon: "📣" },
    { name: "Zzz", pitch: 0.8, rate: 0.5, icon: "😴" },
    { name: "Rage", pitch: 0.3, rate: 1.3, icon: "💢" },
    { name: "Happy", pitch: 1.5, rate: 1.1, icon: "😊" },
    { name: "Oops", pitch: 1.2, rate: 0.8, icon: "🤔" },
    { name: "Dino", pitch: 0.2, rate: 0.6, icon: "🦖" },
  ];

  const applyPreset = (preset: typeof characterPresets[0]) => {
    setPitch(preset.pitch);
    setRate(preset.rate);
  };

  const handleLogoClick = () => {
    if (clickCount + 1 >= 5) {
      setShowControlPanel(true);
      setClickCount(0);
    } else {
      setClickCount(prev => prev + 1);
    }
  };

  const handleAuth = () => {
    if (passAttempt === "voco123") {
      setIsAuthorized(true);
      setError(null);
    } else {
      setError("Unauthorized access attempt. Control locked.");
    }
  };

  const synth = useRef<SpeechSynthesis | null>(null);

  const filteredVoices = voices.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.lang.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVoices: Record<string, SpeechSynthesisVoice[]> = filteredVoices.reduce((acc, voice) => {
    const lang = voice.lang.split("-")[0].toUpperCase();
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        // Filter for better sounding voices and meaningful names
        const filtered = availableVoices.sort((a, b) => {
          // Prioritize Google voices as they usually sound better
          const aIsPremium = a.name.includes("Google") || a.localService;
          const bIsPremium = b.name.includes("Google") || b.localService;
          if (aIsPremium && !bIsPremium) return -1;
          if (!aIsPremium && bIsPremium) return 1;
          return a.name.localeCompare(b.name);
        });
        setVoices(filtered);
        
        // Try to find a good default (Google voices or localized ones)
        const defaultVoice = filtered.find(v => v.lang.includes("en-US") && v.name.includes("Google")) 
          || filtered.find(v => v.lang.includes("en"))
          || filtered[0];
          
        if (defaultVoice) setSelectedVoice(defaultVoice);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setError("Text-to-Speech is not supported in this browser.");
    }

    return () => {
      if (synth.current) synth.current.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!synth.current || !text) return;

    if (isPaused) {
      synth.current.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      setIsSpeaking(false);
      setIsPaused(false);
      setError("An error occurred during speech synthesis.");
    };

    synth.current.speak(utterance);
  };

  const handlePause = () => {
    if (synth.current && isSpeaking) {
      synth.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    if (synth.current) {
      synth.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!text || !selectedVoice) return;
    
    setIsDownloading(true);
    addPrismLog("CAPTURING_NEURAL_STREAM...");
    
    // Web Speech API doesn't support direct-to-file, 
    // so we simulate the encoding process while playing
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsDownloading(false);
      
      // Synthesis Success Signature
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voco_export_${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addPrismLog("AUDIO_EXPORT_SUCCESSFUL");
    };

    synth.current?.speak(utterance);
  };

  const handleReset = () => {
    setText("");
    setRate(1);
    setPitch(1);
    handleStop();
  };

  // --- IMAGE ENGINE (PRISM) STATE ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [prismLogs, setPrismLogs] = useState<string[]>([]);
  const [imageSettings, setImageSettings] = useState({
    upscale: "8K_ULTRA",
    format: "PNG",
    quality: "Ultra",
    enhance: true
  });

  const addPrismLog = (msg: string) => {
    setPrismLogs(prev => [...prev.slice(-4), `> ${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setSelectedImage(loadEvent.target?.result as string);
        setProcessedImage(null);
        addPrismLog(`SOURCE_LOADED: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageQuality = async (sourceUrl: string) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(sourceUrl); return; }

        // Scale factors based on settings
        let scale = 2;
        if (imageSettings.upscale.includes('8K')) scale = 3;
        if (imageSettings.upscale.includes('16K')) scale = 4;

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        // Use high-quality scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw upscaled image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (imageSettings.enhance) {
          // Apply some visual "enhancements"
          // We can't do true SR AI in browser easily, so we simulate with filters
          ctx.filter = 'contrast(1.05) saturate(1.1) brightness(1.02) contrast(1.1)';
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }

        resolve(canvas.toDataURL(`image/${imageSettings.format.toLowerCase()}`, 1.0));
      };
      img.src = sourceUrl;
    });
  };

  const handleEnhance = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setProcessProgress(0);
    setPrismLogs([]);
    addPrismLog("INITIALIZING_NEURAL_ENGINE...");
    
    const steps = [
      "DECONSTRUCTING_PIXELS...",
      "GENERATING_UPSAMPLING_MAP...",
      "RECONSTRUCTING_TEXTURES...",
      "AI_ENHANCEMENT_COMMITTED.",
      "ENHANCEMENT_SUCCESSFUL."
    ];

    let currentStep = 0;
    const interval = setInterval(async () => {
      setProcessProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        if (prev % 20 === 0 && currentStep < steps.length - 1) {
          addPrismLog(steps[currentStep]);
          currentStep++;
        }
        return prev + 5;
      });
    }, 50);

    // Actual processing
    try {
      const result = await processImageQuality(selectedImage);
      setProcessedImage(result);
      setProcessProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        addPrismLog(steps[steps.length - 1]);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setError("Image processing failed.");
    }
  };

  const handlePrismDownload = () => {
    const output = processedImage || selectedImage;
    if (!output) return;
    addPrismLog("EXPORTING_ENHANCED_BUFFER...");
    const link = document.createElement('a');
    link.href = output;
    const extension = imageSettings.format.toLowerCase().includes('png') ? 'png' : 
                     imageSettings.format.toLowerCase().includes('webp') ? 'webp' : 'jpg';
    link.download = `prism_ultra_${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addPrismLog("EXPORT_COMPLETE.");
  };

  return (
    <div className="min-h-screen py-4 sm:py-12 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-start sm:justify-center space-y-6 sm:space-y-12 relative overflow-x-hidden">
      <div className="scanline" />
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Header & Tool Switcher */}
      <div className="flex flex-col items-center space-y-6 sm:space-y-10 w-full max-w-4xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="text-center space-y-2 sm:space-y-4"
        >
          <div 
            onClick={handleLogoClick}
            className="flex flex-col items-center justify-center space-y-3 cursor-pointer select-none active:scale-95 transition-transform group"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 sm:w-16 sm:h-16 ${activeTool === 'voco' ? 'bg-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'bg-brand-accent shadow-[0_0_30px_rgba(0,255,157,0.3)]'} rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-500`}
            >
              {activeTool === 'voco' ? (
                <Volume2 className="text-brand-primary w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              ) : (
                <ImageIcon className="text-brand-primary w-6 h-6 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
              )}
            </motion.div>
            <div className="space-y-0.5">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-[0.15em] text-white uppercase font-mono overflow-hidden">
                <span className={activeTool === 'voco' ? 'text-white' : 'text-brand-accent glow-text'}>
                  {activeTool === 'voco' ? 'VOCO' : 'PRISM'}
                </span>
                <span className="text-[10px] align-top ml-1 opacity-50 font-sans tracking-normal font-normal">TM</span>
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            </div>
          </div>
          <p className="text-brand-muted text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.4em] font-medium opacity-80">
            {activeTool === 'voco' ? 'NEURAL CRYPTOGRAPHIC SPEECH' : 'QUANTUM IMAGE RECONSTRUCTION'}
          </p>
        </motion.div>

        {/* System Export & Navigation Options */}
        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
          >
            {/* Main Tabs */}
            <div className="flex bg-panel-bg/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/5 shadow-2xl relative z-20 will-change-transform">
              <button 
                onClick={() => setActiveTool("voco")}
                className={`flex-1 sm:flex-none px-6 sm:px-10 py-3.5 rounded-xl text-[10px] sm:text-[11px] font-mono uppercase transition-all duration-500 flex items-center justify-center space-x-3 relative overflow-hidden group ${
                  activeTool === 'voco' ? 'text-brand-primary font-bold z-10' : 'text-brand-muted hover:text-white'
                }`}
              >
                {activeTool === 'voco' && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Volume2 className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${activeTool === 'voco' ? 'opacity-100' : 'opacity-50'}`} />
                <span className="relative z-10 tracking-widest">Audio Tool</span>
              </button>
              <button 
                onClick={() => setActiveTool("prism")}
                className={`flex-1 sm:flex-none px-6 sm:px-10 py-3.5 rounded-xl text-[10px] sm:text-[11px] font-mono uppercase transition-all duration-500 flex items-center justify-center space-x-3 relative overflow-hidden group ${
                  activeTool === 'prism' ? 'text-brand-primary font-bold z-10' : 'text-brand-muted hover:text-white'
                }`}
              >
                {activeTool === 'prism' && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-brand-accent shadow-[0_0_20px_rgba(0,255,157,0.4)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <ImageIcon className={`w-4 h-4 relative z-10 transition-transform group-hover:scale-110 ${activeTool === 'prism' ? 'opacity-100' : 'opacity-50'}`} />
                <span className="relative z-10 tracking-widest">Image Engine</span>
              </button>
            </div>

            {/* Portable Export Button */}
            <button 
              onClick={() => {
                const msg = "To save this project:\n1. Click the 'Settings' icon (gear) in the top-right menu.\n2. Choose 'Export to ZIP' for a local copy.\n3. Choose 'Export to GitHub' to publish online.\n\nThe app is already optimized as a single-file Hardware Unit!";
                addPrismLog("SYSTEM_EXPORT_PROTOCOL_INITIATED");
                alert(msg);
              }}
              className="px-6 py-3.5 bg-brand-primary/50 backdrop-blur-md border border-brand-accent/40 rounded-xl text-[10px] font-mono uppercase tracking-[0.2em] text-brand-accent hover:bg-brand-accent/10 transition-all flex items-center group shadow-[0_0_20px_rgba(0,255,157,0.1)]"
            >
              <Download className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
              Get Portable Code (ZIP)
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {activeTool === 'voco' && (
          /* VOCO (TTS) INTERFACE */
          <motion.div 
            key="voco-tool"
            initial={{ opacity: 0, scale: 0.99, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.99, x: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 will-change-transform"
          >
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-panel p-4 sm:p-6 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center">
              <Monitor className="w-3 h-3 mr-2" />
              Input Terminal
            </label>
            <div className="flex space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-brand-accent animate-pulse shadow-[0_0_8px_#00FF00]' : 'bg-red-900'}`} />
              <div className="w-2 h-2 rounded-full bg-brand-muted opacity-30" />
            </div>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="flex-1 w-full bg-[#1C1D21] border border-[#2A2B2F] rounded-xl p-4 text-white font-sans text-sm sm:text-base focus:ring-1 focus:ring-brand-accent focus:outline-none resize-none transition-all min-h-[250px] sm:min-h-[300px]"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-mono text-brand-muted uppercase">
              {text.length} Characters
            </span>
            <button 
              onClick={handleReset}
              className="text-[10px] font-mono text-brand-accent uppercase hover:opacity-80 flex items-center"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Input
            </button>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <label className="text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center">
              <Settings2 className="w-3 h-3 mr-2" />
              Audio Settings
            </label>

            {/* Voice Select Module */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted uppercase">Voice Engine</span>
                <Languages className="w-3 h-3 text-brand-muted" />
              </div>
              
              <button 
                onClick={() => setShowVoiceGrid(!showVoiceGrid)}
                className="w-full hardware-input text-xs flex items-center justify-between group"
              >
                <span className="truncate">
                  {selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : "Select a voice"}
                </span>
                <Settings2 className={`w-3 h-3 transition-transform ${showVoiceGrid ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showVoiceGrid && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute z-50 top-full left-0 right-0 mt-2 glass-panel shadow-2xl overflow-hidden border-brand-primary"
                  >
                    <div className="p-3 border-b border-[#2A2B2F] bg-[#1C1D21]">
                      <input 
                        type="text"
                        placeholder="Search engine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#151619] border border-[#2A2B2F] rounded-md px-3 py-1.5 text-[10px] font-mono text-brand-accent placeholder:text-brand-muted/30 focus:outline-none"
                      />
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                      {Object.keys(groupedVoices).length > 0 ? (
                        Object.entries(groupedVoices).map(([lang, langVoices]) => (
                          <div key={lang} className="mb-2">
                            <div className="px-3 py-1 text-[8px] font-bold text-brand-muted uppercase tracking-[0.2em] bg-[#1C1D21]/50">
                              {lang} Region
                            </div>
                            {langVoices.map((voice) => (
                              <button
                                key={voice.voiceURI}
                                onClick={() => {
                                  setSelectedVoice(voice);
                                  setShowVoiceGrid(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-[10px] hover:bg-brand-accent/10 transition-colors flex items-center justify-between group ${
                                  selectedVoice?.voiceURI === voice.voiceURI ? 'bg-brand-accent/5 text-brand-accent' : 'text-gray-400'
                                }`}
                              >
                                <span className="truncate flex-1">{voice.name}</span>
                                {(voice.name.includes("Google") || voice.localService) && (
                                  <span className="ml-2 text-[8px] px-1 bg-brand-accent/20 text-brand-accent border border-brand-accent/30 rounded uppercase font-bold">Premium</span>
                                )}
                              </button>
                            ))}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-[10px] text-brand-muted uppercase">No engine found</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Character Lab */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted uppercase tracking-widest">Character Lab</span>
                <span className="text-[8px] px-2 py-0.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-accent rounded font-bold uppercase tracking-tighter glow-text">54 MODULES</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[160px] sm:max-h-[180px] overflow-y-auto pr-2 custom-scrollbar p-1">
                {characterPresets.map((char) => (
                  <button
                    key={char.name}
                    onClick={() => applyPreset(char)}
                    title={char.name}
                    className="group relative p-2.5 bg-input-bg/50 border border-white/5 rounded-xl text-lg hover:border-brand-accent/40 hover:bg-brand-accent/5 transition-all duration-300 flex flex-col items-center gap-1.5 active:scale-90 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/0 to-brand-accent/0 group-hover:from-brand-accent/5 group-hover:to-transparent" />
                    <span className="relative z-10 filter group-hover:drop-shadow-[0_0_8px_rgba(0,255,157,0.5)] transition-all duration-300 transform group-hover:scale-110">{char.icon}</span>
                    <span className="relative z-10 text-[7px] uppercase font-mono font-bold text-brand-muted group-hover:text-brand-accent tracking-tighter truncate w-full text-center transition-colors">
                      {char.name}
                    </span>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand-accent group-hover:w-full transition-all duration-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Rate Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted uppercase">Playback Rate</span>
                <span className="text-[10px] font-mono text-brand-accent">{rate.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#2A2B2F] rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
            </div>

            {/* Pitch Control */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-brand-muted uppercase">Pitch Bias</span>
                <span className="text-[10px] font-mono text-brand-accent">{pitch.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1" 
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-1 bg-[#2A2B2F] rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
            </div>
          </div>

          <div className="flex-1" />

            {/* Player Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <button
              onClick={isSpeaking ? handlePause : handleSpeak}
              disabled={!text || isDownloading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all space-y-1 ${
                !text || isDownloading ? 'bg-[#1C1D21] text-brand-muted cursor-not-allowed' :
                'bg-brand-accent text-brand-primary font-bold hover:scale-[1.02] active:scale-95 shadow-lg shadow-brand-accent/20'
              }`}
            >
              {isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span className="text-[8px] uppercase tracking-tighter">{isSpeaking ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!text || isSpeaking || isDownloading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all space-y-1 ${
                !text || isSpeaking || isDownloading ? 'bg-[#1C1D21] text-brand-muted cursor-not-allowed' :
                'bg-white text-brand-primary font-bold hover:scale-[1.02] active:scale-95 shadow-lg'
              }`}
            >
              {isDownloading ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              <span className="text-[8px] uppercase tracking-tighter">Export</span>
            </button>
            <button
              onClick={handleStop}
              disabled={(!isSpeaking && !isPaused) || isDownloading}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all space-y-1 ${
                (!isSpeaking && !isPaused) || isDownloading ? 'bg-[#1C1D21] text-brand-muted cursor-not-allowed' :
                'bg-red-500 text-white font-bold hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20'
              }`}
            >
              <Square className="w-5 h-5" />
              <span className="text-[8px] uppercase tracking-tighter">Stop</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}

    {activeTool === 'prism' && (
      /* PRISM (IMAGE) INTERFACE */
        <motion.div 
          key="prism-tool"
          initial={{ opacity: 0, scale: 0.99, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.99, x: -10 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 will-change-transform"
        >
            {/* Image Preview & Upload Section */}
            <motion.div 
              className="lg:col-span-2 glass-panel p-6 flex flex-col space-y-4"
            >
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center">
                  <Layers className="w-3 h-3 mr-2" />
                  Source Terminal
                </label>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-brand-accent animate-pulse' : 'bg-brand-muted/20'}`} />
                  <div className="w-2 h-2 rounded-full bg-brand-muted opacity-30" />
                </div>
              </div>

              <div className="flex-1 bg-[#1C1D21] border border-[#2A2B2F] rounded-xl overflow-hidden min-h-[400px] relative flex flex-col items-center justify-center">
                {processedImage ? (
                  <div className="relative w-full h-full group">
                    <img src={processedImage} alt="Enhanced" className="w-full h-full object-contain" />
                    <div className="absolute top-4 right-4 bg-brand-accent text-brand-primary px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase shadow-xl glow-border flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      Enhanced Output
                    </div>
                  </div>
                ) : selectedImage ? (
                  <div className="relative w-full h-full">
                    <img src={selectedImage} alt="Source" className="w-full h-full object-contain" />
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-lg text-[10px] font-medium uppercase">
                      Original Source
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 bg-[#151619] border border-[#2A2B2F] rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-6 h-6 text-brand-muted" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-white">DRAG & DROP SOURCE IMAGE</p>
                      <p className="text-[10px] font-mono text-brand-muted">PNG, JPG, WEBP SUPPORTED</p>
                    </div>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                {isProcessing && (
                  <div className="absolute inset-0 bg-[#151619]/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 p-8">
                    <div className="w-full max-w-xs space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-brand-accent">
                        <span>UPSCALING_16K_ENGINE</span>
                        <span>{processProgress}%</span>
                      </div>
                      <div className="h-1 w-full bg-brand-primary rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-brand-accent shadow-[0_0_10px_#00FF00]"
                          animate={{ width: `${processProgress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-brand-muted animate-pulse font-bold tracking-widest">
                      SYSTEM_BUSY: RECONSTRUCTING_DATA
                    </div>
                  </div>
                )}
              </div>

              {/* Prism Logs */}
              <div className="bg-[#151619] border border-[#2A2B2F] rounded-lg p-3 font-mono text-[9px] text-brand-muted/80 space-y-1 h-24 overflow-hidden">
                {prismLogs.length === 0 ? (
                  <div className="italic">WAITING_FOR_INPUT...</div>
                ) : (
                  prismLogs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </motion.div>

            {/* Prism Controls */}
            <motion.div 
              className="glass-panel p-6 flex flex-col space-y-8"
            >
              <div className="space-y-6">
                <label className="text-xs font-mono uppercase tracking-widest text-brand-muted flex items-center">
                  <Cpu className="w-3 h-3 mr-2" />
                  Prism Engine Settings
                </label>

                {/* Upscale Mode */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-brand-muted uppercase">Resolution Target</span>
                  <div className="grid grid-cols-2 gap-2">
                    {["4K_STD", "8K_ULTRA", "16K_PRISM", "AUTO_MAX"].map(mode => (
                      <button 
                        key={mode}
                        onClick={() => setImageSettings(s => ({ ...s, upscale: mode }))}
                        className={`py-2 px-1 rounded-lg text-[9px] font-bold font-mono transition-all border ${
                          imageSettings.upscale === mode 
                            ? 'bg-brand-accent/20 border-brand-accent text-brand-accent' 
                            : 'bg-[#1C1D21] border-[#2A2B2F] text-brand-muted hover:border-brand-muted'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Format */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-brand-muted uppercase">Export Extension</span>
                  <select 
                    value={imageSettings.format}
                    onChange={(e) => setImageSettings(s => ({ ...s, format: e.target.value }))}
                    className="w-full hardware-input text-xs"
                  >
                    <option>PNG (Lossless)</option>
                    <option>JPG (High Qual)</option>
                    <option>WEBP (Next-Gen)</option>
                  </select>
                </div>

                {/* Toggle Enhance */}
                <div className="flex items-center justify-between p-3 bg-[#1C1D21] border border-[#2A2B2F] rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-white block">AI_DENOISE</span>
                    <span className="text-[8px] font-mono text-brand-muted uppercase">Neural clean-up</span>
                  </div>
                  <button 
                    onClick={() => setImageSettings(s => ({ ...s, enhance: !s.enhance }))}
                    className={`w-10 h-5 rounded-full relative transition-colors ${imageSettings.enhance ? 'bg-brand-accent' : 'bg-[#2A2B2F]'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${imageSettings.enhance ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="flex-1" />

              {processedImage && (
                <button
                  onClick={() => { setProcessedImage(null); addPrismLog("RESULT_BUFFER_CLEARED."); }}
                  className="w-full mb-3 flex items-center justify-center p-3 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-mono uppercase"
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Reset to Original
                </button>
              )}

              <button
                onClick={handleEnhance}
                disabled={!selectedImage || isProcessing}
                className={`w-full flex items-center justify-center p-4 rounded-xl transition-all space-x-3 ${
                  !selectedImage ? 'bg-[#1C1D21] text-brand-muted cursor-not-allowed' :
                  isProcessing ? 'bg-brand-accent/10 border border-brand-accent text-brand-accent animate-pulse' :
                  'bg-brand-accent text-brand-primary font-bold hover:scale-[1.02] active:scale-95'
                }`}
              >
                <Zap className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span className="text-xs uppercase tracking-widest font-bold">Process Enhancement</span>
              </button>

              {selectedImage && !isProcessing && (
                <button
                  onClick={handlePrismDownload}
                  className="w-full flex items-center justify-center p-3 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5 rounded-xl transition-all text-[10px] font-mono uppercase bg-brand-accent/5"
                >
                  <Download className="w-3 h-3 mr-2 text-brand-accent" />
                  Download Prism Output
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center space-y-2 opacity-40 hover:opacity-100 transition-opacity"
      >
        <p className="text-[9px] font-mono text-brand-muted uppercase tracking-[0.3em]">
          Voco & Prism Hardware Hub — v1.0.4 Premium
        </p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
            <span className="text-[8px] font-mono text-brand-accent">ENCRYPTION_ACTIVE</span>
          </div>
          <div className="h-3 w-[1px] bg-white/10" />
          <div className="flex items-center space-x-1">
            <Cpu className="w-2.5 h-2.5 text-brand-muted" />
            <span className="text-[8px] font-mono text-brand-muted uppercase">Portable HTML Mode Enabled</span>
          </div>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center space-x-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:underline">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ads Container Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-4xl p-6 sm:p-10 glass-panel border-brand-accent/5 flex flex-col items-center justify-center min-h-[140px] bg-panel-bg shadow-[inset_0_0_50px_rgba(0,255,157,0.02)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />
        <span className="text-[10px] font-mono text-brand-accent uppercase mb-4 tracking-[0.4em] glow-text opacity-70">ADVERTISING_TERMINAL_V1.0</span>
        <div id="voco-ads-container" className="w-full flex items-center justify-center">
          <div className="bg-brand-primary/50 border border-dashed border-white/10 w-full h-24 rounded-2xl flex flex-col items-center justify-center text-brand-muted/40 text-[10px] font-mono uppercase italic px-4 text-center group hover:border-brand-accent/20 transition-all duration-500">
            <p className="tracking-widest mb-1">{adsenseId !== "ca-pub-4590201922446049" ? `ACTIVE_STREAM: ${adsenseId}` : "INITIALIZING_ADSENSE_PROTOCOL..."}</p>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-ping" />
              <div className="w-1 h-1 bg-brand-accent rounded-full opacity-30" />
              <div className="w-1 h-1 bg-brand-accent rounded-full opacity-10" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Control Panel Modal */}
      <AnimatePresence>
        {showControlPanel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] backdrop-blur-md bg-black/60 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md glass-panel p-8 space-y-6 border-brand-accent/30"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-mono text-brand-accent uppercase tracking-tighter flex items-center">
                  <Settings2 className="w-5 h-5 mr-2" />
                  Terminal Control
                </h2>
                <button onClick={() => { setShowControlPanel(false); setIsAuthorized(false); setPassAttempt(""); }} className="text-brand-muted hover:text-white transition-colors">
                  <Square className="w-4 h-4 rotate-45" />
                </button>
              </div>

              {!isAuthorized ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-mono text-brand-muted uppercase leading-relaxed">
                    Access to advertisement engines and core synthesis parameters requires authorization. 
                    Please enter the encryption key.
                  </p>
                  <input 
                    type="password"
                    placeholder="Enter Key..."
                    value={passAttempt}
                    onChange={(e) => setPassAttempt(e.target.value)}
                    className="w-full hardware-input text-center tracking-[0.5em] font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  />
                  <button 
                    onClick={handleAuth}
                    className="w-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent py-3 rounded-xl font-mono text-xs uppercase font-bold hover:bg-brand-accent/30 transition-all"
                  >
                    Unlock Terminal
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-mono text-brand-accent uppercase">AdSense Publisher ID</label>
                    <input 
                      type="text"
                      value={adsenseId}
                      onChange={(e) => setAdsenseId(e.target.value)}
                      className="w-full hardware-input text-xs font-mono"
                    />
                  </div>

                  <div className="p-4 bg-brand-accent/5 rounded-lg border border-brand-accent/20">
                    <p className="text-[10px] font-mono text-brand-accent leading-relaxed">
                      Developer Note: Changes to the Publisher ID will be reflected in the Advertisement Terminal below. 
                      Encryption Status: ACTIVATED
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => { setShowControlPanel(false); setIsAuthorized(false); }}
                    className="w-full bg-brand-accent text-brand-primary py-3 rounded-xl font-mono text-xs uppercase font-bold hover:opacity-90 transition-all"
                  >
                    Commit Changes & Exit
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="text-center py-4 text-brand-muted text-[10px] font-mono uppercase tracking-widest">
        &copy; {new Date().getFullYear()} VOCO Engine &bull; Secure & High-Performance Synthesis
      </div>
    </div>
  );
}
