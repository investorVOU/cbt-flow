import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFingerprint, faIdCard, faCheck, faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

interface BiometricCaptureProps {
  onCapture: (data: { type: string; data: string; confidence: number }) => void;
  onError: (error: string) => void;
}

export function BiometricCapture({ onCapture, onError }: BiometricCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captureMode, setCaptureMode] = useState<'face' | 'fingerprint' | 'id' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startCamera = async (mode: 'face' | 'id') => {
    try {
      setCaptureMode(mode);
      setIsCapturing(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: mode === 'face' ? 'user' : 'environment'
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      onError(`Failed to access camera: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
    setCaptureMode(null);
    setCapturedImage(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    
    // Simulate biometric processing
    setIsProcessing(true);
    
    setTimeout(() => {
      const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      const type = captureMode === 'face' ? 'face_scan' : 'id_upload';
      
      onCapture({
        type,
        data: imageData,
        confidence
      });
      
      setIsProcessing(false);
      stopCamera();
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      onError('Please upload an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      setIsProcessing(true);
      
      setTimeout(() => {
        const confidence = Math.random() * 0.2 + 0.8; // 80-100% confidence for uploaded ID
        
        onCapture({
          type: 'id_upload',
          data: imageData,
          confidence
        });
        
        setIsProcessing(false);
      }, 1500);
    };
    
    reader.readAsDataURL(file);
  };

  const simulateFingerprint = () => {
    setIsProcessing(true);
    setCaptureMode('fingerprint');
    
    // Simulate fingerprint scanning process
    setTimeout(() => {
      const confidence = Math.random() * 0.25 + 0.75; // 75-100% confidence
      const fingerprintHash = btoa(Math.random().toString(36)).substring(0, 16);
      
      onCapture({
        type: 'biometric',
        data: fingerprintHash,
        confidence
      });
      
      setIsProcessing(false);
      setCaptureMode(null);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faFingerprint} className="text-primary" />
            Biometric Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Face Scan */}
            <Button
              onClick={() => startCamera('face')}
              disabled={isCapturing || isProcessing}
              className="h-20 flex-col gap-2"
              data-testid="button-face-scan"
            >
              <FontAwesomeIcon icon={faCamera} className="text-xl" />
              Face Scan
            </Button>

            {/* Fingerprint */}
            <Button
              onClick={simulateFingerprint}
              disabled={isCapturing || isProcessing}
              className="h-20 flex-col gap-2"
              variant="secondary"
              data-testid="button-fingerprint"
            >
              <FontAwesomeIcon icon={faFingerprint} className="text-xl" />
              Fingerprint
            </Button>

            {/* ID Upload */}
            <div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isCapturing || isProcessing}
                className="h-20 flex-col gap-2 w-full"
                variant="outline"
                data-testid="button-id-upload"
              >
                <FontAwesomeIcon icon={faIdCard} className="text-xl" />
                Upload ID
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera View */}
      {isCapturing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{captureMode === 'face' ? 'Face Recognition' : 'ID Scanning'}</span>
              <Button onClick={stopCamera} variant="outline" size="sm">
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay guide */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white rounded-lg w-48 h-32 opacity-50"></div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={capturePhoto}
                  disabled={isProcessing}
                  size="lg"
                  data-testid="button-capture-photo"
                >
                  <FontAwesomeIcon icon={faCamera} />
                  Capture
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing & Results */}
      {(isProcessing || capturedImage) && (
        <Card>
          <CardContent className="p-6">
            {isProcessing && (
              <Alert>
                <AlertDescription className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                  {captureMode === 'fingerprint' 
                    ? 'Processing biometric data...' 
                    : 'Analyzing captured image...'}
                </AlertDescription>
              </Alert>
            )}
            
            {capturedImage && !isProcessing && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="text-success" />
                  <span className="font-medium">Verification Complete</span>
                  <Badge variant="outline" className="bg-success/10 text-success">
                    High Confidence
                  </Badge>
                </div>
                
                {captureMode !== 'fingerprint' && (
                  <img
                    src={capturedImage}
                    alt="Captured verification"
                    className="w-full max-w-sm rounded-lg border mx-auto"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}