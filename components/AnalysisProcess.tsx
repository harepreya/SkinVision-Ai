"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle } from "lucide-react"

interface AnalysisProcessProps {
  imageData: string | null
}

export function AnalysisProcess({ imageData }: AnalysisProcessProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Initializing analysis...")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [detectedFeatures, setDetectedFeatures] = useState<string[]>([])

  const steps = [
    { name: "Initializing analysis...", duration: 800 },
    { name: "Detecting facial features...", duration: 1200 },
    { name: "Analyzing skin texture...", duration: 1500 },
    { name: "Identifying skin type...", duration: 1000 },
    { name: "Detecting skin concerns...", duration: 1300 },
    { name: "Analyzing pore size and distribution...", duration: 900 },
    { name: "Measuring skin hydration levels...", duration: 1100 },
    { name: "Evaluating skin elasticity...", duration: 1000 },
    { name: "Generating personalized recommendations...", duration: 1400 },
    { name: "Finalizing results...", duration: 800 },
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout

    const runAnalysis = () => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex]
        setCurrentStep(step.name)

        // Calculate progress percentage based on completed steps
        const totalStepsDuration = steps.reduce((total, step) => total + step.duration, 0)
        const completedDuration = steps.slice(0, currentStepIndex).reduce((total, step) => total + step.duration, 0)
        const progressPercentage = Math.round((completedDuration / totalStepsDuration) * 100)

        setProgress(progressPercentage)

        // Add random detected features at specific steps
        if (currentStepIndex === 2) {
          // During skin texture analysis
          setDetectedFeatures((prev) => [...prev, "Fine texture detected"])
        } else if (currentStepIndex === 3) {
          // During skin type identification
          setDetectedFeatures((prev) => [...prev, "Combination skin pattern identified"])
        } else if (currentStepIndex === 4) {
          // During concerns detection
          setDetectedFeatures((prev) => [...prev, "Minor hyperpigmentation detected", "T-zone oiliness detected"])
        }

        // Schedule next step
        timer = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, step.name])
          setCurrentStepIndex((prevIndex) => prevIndex + 1)
        }, step.duration)
      }
    }

    runAnalysis()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [currentStepIndex])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Analyzing Your Skin</h2>
        <p className="text-muted-foreground">Our AI is processing your image to provide personalized recommendations</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 space-y-6">
          {imageData && (
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <img
                src={imageData || "/placeholder.svg"}
                alt="Analyzing"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>

              {/* Detected features overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {detectedFeatures.map((feature, index) => (
                  <Badge key={index} variant="outline" className="bg-black/50 text-white border-white/20">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{currentStep}</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />

            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium">Completed steps:</p>
              <div className="space-y-1">
                {completedSteps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Analysis in progress</p>
              <p>
                Our AI is analyzing over 25 different skin parameters to provide you with accurate results and
                personalized recommendations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

