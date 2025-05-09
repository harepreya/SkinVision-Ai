"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, RefreshCw, Pause, Play, AlertCircle, Check, Move } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { detectFace } from "@/lib/faceDetection"

interface ImageCaptureProps {
  onImageCaptured: (imageData: string) => void
}

export function ImageCapture({ onImageCaptured }: ImageCaptureProps) {
  const [activeTab, setActiveTab] = useState("camera")
  const [isCameraAvailable, setIsCameraAvailable] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [skinTone, setSkinTone] = useState<string | null>(null)
  const [lightingQuality, setLightingQuality] = useState<"poor" | "fair" | "good" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null)

  // Check if camera is available
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsCameraAvailable(true)
    }
  }, [])

  // Start camera when tab is active
  useEffect(() => {
    if (activeTab === "camera" && isCameraAvailable && !isCameraActive && !permissionDenied) {
      startCamera()
    }

    return () => {
      stopCamera()
    }
  }, [activeTab, isCameraAvailable, permissionDenied])

  // Face detection loop
  useEffect(() => {
    if (isCameraActive && !isPaused && videoRef.current && canvasRef.current) {
      const runFaceDetection = async () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (!context || video.paused || video.ended) return

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        try {
          // Get image data for face detection
          const imageData = canvas.toDataURL("image/jpeg", 0.8)

          // Detect face in the image
          const detectionResult = await detectFace(imageData)

          if (detectionResult.faceDetected) {
            setFaceDetected(true)
            setSkinTone(detectionResult.skinTone)
            setLightingQuality(detectionResult.lightingQuality)
          } else {
            setFaceDetected(false)
          }
        } catch (error) {
          console.error("Face detection error:", error)
        }
      }

      // Run face detection every 1000ms to reduce performance impact
      faceDetectionInterval.current = setInterval(runFaceDetection, 1000)

      return () => {
        if (faceDetectionInterval.current) {
          clearInterval(faceDetectionInterval.current)
        }
      }
    }
  }, [isCameraActive, isPaused])

  const startCamera = async () => {
    try {
      setCameraError(null)
      setPermissionDenied(false)

      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsCameraActive(true)
        setIsPaused(false)
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err)

      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true)
        setCameraError("Camera access denied. Please grant permission to use your camera.")
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No camera found. Please connect a camera and try again.")
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Camera is in use by another application. Please close other applications using your camera.")
      } else {
        setCameraError(`Error accessing camera: ${err.message || "Unknown error"}`)
      }

      setIsCameraAvailable(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setIsCameraActive(false)
      setIsPaused(false)
    }

    if (faceDetectionInterval.current) {
      clearInterval(faceDetectionInterval.current)
      faceDetectionInterval.current = null
    }
  }

  const togglePauseCamera = () => {
    if (isPaused) {
      // Resume video
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.play()
        setIsPaused(false)
      }
    } else {
      // Pause video
      if (videoRef.current) {
        videoRef.current.pause()
        setIsPaused(true)
      }
    }
  }

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      setIsProcessing(true)

      try {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          const imageData = canvas.toDataURL("image/jpeg", 0.9)

          // Verify face is present in the captured image
          const detectionResult = await detectFace(imageData)

          if (!detectionResult.faceDetected) {
            setCameraError("No face detected in the image. Please position your face in the frame and try again.")
            setIsProcessing(false)
            return
          }

          if (detectionResult.lightingQuality === "poor") {
            setCameraError("Poor lighting detected. Please move to a well-lit area for better results.")
            setIsProcessing(false)
            return
          }

          setCapturedImage(imageData)
          stopCamera()
        }
      } catch (error) {
        console.error("Error capturing image:", error)
        setCameraError("Error capturing image. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setCameraError(null)
    if (activeTab === "camera") {
      startCamera()
    }
  }

  const confirmImage = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage)
    }
  }

  // File upload handling
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsProcessing(true)
      setCameraError(null)

      try {
        const file = acceptedFiles[0]
        const reader = new FileReader()

        reader.onload = async (e) => {
          if (e.target?.result) {
            const imageData = e.target.result as string

            // Verify face is present in the uploaded image
            const detectionResult = await detectFace(imageData)

            if (!detectionResult.faceDetected) {
              setCameraError("No face detected in the image. Please upload a clear photo of your face.")
              setIsProcessing(false)
              return
            }

            if (detectionResult.lightingQuality === "poor") {
              setCameraError("The uploaded image has poor lighting. This may affect analysis accuracy.")
            }

            setCapturedImage(imageData)
            setSkinTone(detectionResult.skinTone)
          }
          setIsProcessing(false)
        }

        reader.onerror = () => {
          setCameraError("Error reading file. Please try another image.")
          setIsProcessing(false)
        }

        reader.readAsDataURL(file)
      } catch (error) {
        console.error("Error processing uploaded image:", error)
        setCameraError("Error processing image. Please try another image.")
        setIsProcessing(false)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    disabled: isProcessing,
  })

  const renderCameraGuide = () => {
    if (!showGuide || !isCameraActive || isPaused) return null

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Face outline guide */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-primary/70 rounded-full flex items-center justify-center">
          <div className="text-center text-primary/70 text-sm px-4">Position your face within this circle</div>
        </div>

        {/* Close button - this needs to be clickable */}
        <div className="absolute top-2 right-2 pointer-events-auto">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full bg-background/80"
            onClick={() => setShowGuide(false)}
          >
            <span className="sr-only">Close guide</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Capture Your Skin Image</h2>
        <p className="text-muted-foreground">
          For best results, use a clear, well-lit photo of your face without makeup
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" disabled={!isCameraAvailable && !permissionDenied}>
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {cameraError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{cameraError}</AlertDescription>

                  {permissionDenied && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">To fix this:</p>
                      <ol className="text-sm list-decimal pl-5 mt-1 space-y-1">
                        <li>Click the camera icon in your browser's address bar</li>
                        <li>Select "Allow" for camera access</li>
                        <li>Refresh the page</li>
                      </ol>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                        Refresh Page
                      </Button>
                    </div>
                  )}
                </Alert>
              )}

              {!capturedImage ? (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                    {/* Camera status indicator */}
                    {isCameraActive && (
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"}`}
                        />
                        <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                          {isPaused ? "Paused" : "Recording"}
                        </span>
                      </div>
                    )}

                    {/* Face detection indicator */}
                    {isCameraActive && faceDetected && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="outline" className="bg-green-500/20 text-white border-green-500">
                          <Check className="w-3 h-3 mr-1" /> Face Detected
                        </Badge>
                      </div>
                    )}

                    {/* Lighting quality indicator */}
                    {isCameraActive && lightingQuality && (
                      <div className="absolute bottom-4 left-4">
                        <Badge
                          variant="outline"
                          className={`
                            ${
                              lightingQuality === "good"
                                ? "bg-green-500/20 border-green-500 text-white"
                                : lightingQuality === "fair"
                                  ? "bg-yellow-500/20 border-yellow-500 text-white"
                                  : "bg-red-500/20 border-red-500 text-white"
                            }
                          `}
                        >
                          {lightingQuality === "good"
                            ? "Good Lighting"
                            : lightingQuality === "fair"
                              ? "Fair Lighting"
                              : "Poor Lighting"}
                        </Badge>
                      </div>
                    )}

                    {/* Camera controls */}
                    {isCameraActive && (
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                          onClick={togglePauseCamera}
                        >
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/50 border-white/20 text-white hover:bg-black/70"
                          onClick={() => setShowGuide(!showGuide)}
                        >
                          <Move className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {/* Camera guide overlay */}
                    {renderCameraGuide()}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        if (isCameraActive) {
                          stopCamera()
                        } else {
                          startCamera()
                        }
                      }}
                    >
                      {isCameraActive ? (
                        <>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Stop Camera
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Start Camera
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={captureImage}
                      className="flex-1"
                      disabled={!isCameraActive || isPaused || isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Capture Photo
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Camera tips */}
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <h4 className="font-medium mb-1">Tips for best results:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Ensure your face is well-lit from the front</li>
                      <li>Remove glasses, hats, or hair covering your face</li>
                      <li>Position your face within the guide circle</li>
                      <li>Keep a neutral expression</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />

                    {/* Skin tone indicator */}
                    {skinTone && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          Detected Skin Tone: {skinTone}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={retakePhoto}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button onClick={confirmImage}>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm & Analyze
                    </Button>
                  </div>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardContent className="p-6">
              {cameraError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}

              {!capturedImage ? (
                <>
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                      transition-colors aspect-video flex flex-col items-center justify-center
                      ${isProcessing ? "opacity-70 pointer-events-none" : ""}
                      ${
                        isDragActive
                          ? "border-primary bg-primary/5 dark:bg-primary/10"
                          : "border-muted-foreground/20 hover:border-muted-foreground/30 dark:hover:border-muted-foreground/40"
                      }
                    `}
                  >
                    <input {...getInputProps()} />

                    {isProcessing ? (
                      <div className="space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto animate-spin" />
                        <p>Processing image...</p>
                        <Progress value={45} className="w-64 mx-auto" />
                      </div>
                    ) : isDragActive ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-primary font-medium">Drop the image here ...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">Drag and drop an image here, or click to select a file</p>
                          <p className="text-sm text-muted-foreground">
                            For best results, use a clear, well-lit photo of your face
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Select Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload tips */}
                  <div className="bg-muted p-3 rounded-lg text-sm mt-4">
                    <h4 className="font-medium mb-1">Image requirements:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Clear, front-facing photo of your face</li>
                      <li>Good lighting (natural daylight is best)</li>
                      <li>No filters or heavy makeup</li>
                      <li>JPG, PNG or HEIC format</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <img
                      src={capturedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />

                    {/* Skin tone indicator */}
                    {skinTone && (
                      <div className="absolute bottom-4 left-4">
                        <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                          Detected Skin Tone: {skinTone}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={retakePhoto}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Choose Another
                    </Button>
                    <Button onClick={confirmImage}>
                      <Check className="w-4 h-4 mr-2" />
                      Confirm & Analyze
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

