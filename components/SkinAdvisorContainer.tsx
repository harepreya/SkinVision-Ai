"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Steps } from "@/components/Steps"
import { ImageCapture } from "@/components/ImageCapture"
import { AnalysisProcess } from "@/components/AnalysisProcess"
import { ResultsDisplay } from "@/components/ResultsDisplay"
import { DermatologistConsult } from "@/components/DermatologistConsult"
import { ThemeToggle } from "@/components/ThemeToggle"
import WelcomeScreen from "@/components/WelcomeScreen"
import { analyzeSkin } from "@/lib/analyzeSkin"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type Step = "welcome" | "capture" | "analyzing" | "results" | "consult"

export default function SkinAdvisorContainer() {
  const [currentStep, setCurrentStep] = useState<Step>("welcome")
  const [imageData, setImageData] = useState<string | null>(null)
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [previousStep, setPreviousStep] = useState<Step | null>(null)
  const [isFirstVisit, setIsFirstVisit] = useState(true)

  // Check if this is the first visit
  useEffect(() => {
    try {
      const hasVisitedBefore = localStorage.getItem("hasVisitedSkinAdvisor")
      if (hasVisitedBefore) {
        setIsFirstVisit(false)
        setCurrentStep("capture")
      } else {
        // Set the flag for future visits
        localStorage.setItem("hasVisitedSkinAdvisor", "true")
      }
    } catch (error) {
      // If localStorage is not available, just continue
      console.error("LocalStorage error:", error)
      setCurrentStep("capture")
    }
  }, [])

  const handleStartAnalysis = () => {
    setCurrentStep("capture")
  }

  const handleImageCapture = (imageData: string) => {
    setPreviousStep("capture")
    setImageData(imageData)
    setCurrentStep("analyzing")

    // Create a FormData object with the image
    const formData = new FormData()
    const blob = dataURItoBlob(imageData)
    formData.append("image", blob, "image.jpg")

    // Start the analysis process
    analyzeSkin(formData).then((results) => {
      setAnalysisResults(results)
      setCurrentStep("results")
    })
  }

  const handleConsultDermatologist = () => {
    setPreviousStep("results")
    setCurrentStep("consult")
  }

  const handleBackToResults = () => {
    setCurrentStep("results")
  }

  const handleStartOver = () => {
    setImageData(null)
    setAnalysisResults(null)
    setCurrentStep("capture")
  }

  const handleGoBack = () => {
    if (previousStep) {
      setCurrentStep(previousStep)
    }
  }

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI: string) => {
    try {
      const byteString = atob(dataURI.split(",")[1])
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      return new Blob([ab], { type: mimeString })
    } catch (error) {
      console.error("Error converting data URI to Blob:", error)
      // Return a small empty blob as fallback
      return new Blob([""], { type: "image/jpeg" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {currentStep !== "welcome" && previousStep && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="mr-2"
              disabled={!previousStep || currentStep === "analyzing"}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Go back</span>
            </Button>
          )}
          <h1 className="text-4xl font-bold text-primary">AI Skin Advisor</h1>
        </div>
        <ThemeToggle />
      </div>

      <p className="text-center text-muted-foreground mb-8">
        Personalized skincare analysis and dermatologist consultations
      </p>

      {currentStep === "welcome" ? (
        <WelcomeScreen onStart={handleStartAnalysis} isFirstVisit={isFirstVisit} />
      ) : (
        <Card className="overflow-hidden shadow-lg border-primary/10 dark:border-primary/20">
          <Steps currentStep={currentStep} />

          <div className="p-6">
            {currentStep === "capture" && <ImageCapture onImageCaptured={handleImageCapture} />}

            {currentStep === "analyzing" && <AnalysisProcess imageData={imageData} />}

            {currentStep === "results" && analysisResults && (
              <ResultsDisplay
                results={analysisResults}
                imageData={imageData}
                onConsultDermatologist={handleConsultDermatologist}
                onStartOver={handleStartOver}
              />
            )}

            {currentStep === "consult" && (
              <DermatologistConsult
                onBack={handleBackToResults}
                skinType={analysisResults?.skinType}
                concerns={analysisResults?.concerns}
              />
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

