import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import { foodDatabase } from "../data/foods";
import { useNutrition } from "../hooks/useNutrition";
import FoodCard from "../components/FoodCard";

export default function VisionScanner() {
  const navigate = useNavigate();
  const { addFood, today } = useNutrition();
  
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [flash, setFlash] = useState(false);
  const [stream, setStream] = useState(null);

  // Initialize Camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    if (isScanning || scanResult) return;
    
    setFlash(true);
    setIsScanning(true);
    
    // Hide flash after 400ms
    setTimeout(() => setFlash(false), 400);

    // Simulate AI analysis delay
    setTimeout(() => {
      // Pick a random food or something interesting
      const randomIndex = Math.floor(Math.random() * foodDatabase.length);
      const food = foodDatabase[randomIndex];
      
      setScanResult(food);
      setIsScanning(false);
    }, 2500);
  };

  const handleAdd = (food, meal, qty) => {
    addFood(today, meal, food, qty);
    // Navigate home or show success then close
    setTimeout(() => navigate("/"), 800);
  };

  const resetScan = () => {
    setScanResult(null);
    setIsScanning(false);
  };

  if (hasPermission === false) {
    return (
      <div className="scanner-page" style={{ justifyContent: "center", alignItems: "center", padding: 20 }}>
        <div className="card" style={{ textAlign: "center" }}>
          <h2 className="mb-12">Camera Access Denied</h2>
          <p className="mb-16" style={{ color: "var(--text-secondary)" }}>
            Please enable camera permissions in your browser to use the Food Vision Scanner.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scanner-page">
      <div className="scanner-header">
        <button className="btn btn-icon btn-ghost" onClick={() => navigate(-1)} style={{ background: "rgba(0,0,0,0.5)" }}>
          <X size={20} color="white" />
        </button>
        <div style={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>VISION SCANNER</div>
        <button className="btn btn-icon btn-ghost" style={{ background: "rgba(0,0,0,0.5)" }}>
          <Zap size={20} color="white" />
        </button>
      </div>

      <div className="scanner-video-container">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="scanner-video" 
          muted
        />
        
        {/* Viewfinder Overlay */}
        {!scanResult && (
          <div className="scanner-overlay">
            <div className="scanner-viewfinder">
              <div className="scanner-corner corner-tl" />
              <div className="scanner-corner corner-tr" />
              <div className="scanner-corner corner-bl" />
              <div className="scanner-corner corner-br" />
              
              {isScanning && <div className="scanner-laser" />}
            </div>
          </div>
        )}

        {flash && <div className="flash-effect" />}
      </div>

      <div className="scanner-footer">
        {!isScanning && !scanResult && (
          <>
            <button className="scan-btn-main" onClick={handleScan}>
              <div className="scan-btn-inner" />
            </button>
            <p className="mt-16" style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem", fontWeight: 600 }}>
              POINT AT FOOD TO ANALYZE
            </p>
          </>
        )}

        {isScanning && (
          <div style={{ textAlign: "center" }}>
            <div className="scan-analyzing">Analyzing Image...</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: 8 }}>
              Neural engine identifying nutrients
            </div>
          </div>
        )}

        {scanResult && (
          <div className="result-card-overlay">
            <div className="section-header" style={{ marginBottom: 12 }}>
              <h2 style={{ color: "white", fontSize: "1.1rem" }}>
                <CheckCircle2 size={18} style={{ color: "var(--accent)", verticalAlign: "middle", marginRight: 6 }} />
                Food Identified
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={resetScan} style={{ background: "rgba(255,255,255,0.1)" }}>
                <RefreshCw size={14} style={{ marginRight: 4 }} /> Retake
              </button>
            </div>
            <FoodCard food={scanResult} onAdd={handleAdd} />
          </div>
        )}
      </div>
    </div>
  );
}
