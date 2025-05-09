"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ImageUploader from "./ImageUploader"
import AnalysisResults from "./AnalysisResults"
import RecommendationsDisplay from "./RecommendationsDisplay"
import ProgressTracker from "./ProgressTracker"

interface SkinAdvisorProps {
  analyzeAction: (formData: FormData) => Promise<{
    skinType: string
    concerns: string[]
    recommendations: {
      routine: string[]
      products: string[]
      lifestyle: string[]
    }
  }>
  initialProgress: { date: string; score: number }[]
}

export default function SkinAdvisor({ analyzeAction, initialProgress }: SkinAdvisorProps) {
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (imageUrl: string) => {
    setImage(imageUrl)
    setStep(2)
  }

  const handleAnalysis = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await analyzeAction(formData)
      setAnalysis(result)
      setStep(3)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setError("Error analyzing image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={step < 1}>
              Upload
            </TabsTrigger>
            <TabsTrigger value="analyze" disabled={step < 2}>
              Analyze
            </TabsTrigger>
            <TabsTrigger value="results" disabled={step < 3}>
              Results
            </TabsTrigger>
            <TabsTrigger value="progress" disabled={step < 3}>
              Progress
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <ImageUploader onImageUpload={handleImageUpload} />
          </TabsContent>
          <TabsContent value="analyze">
            {image && (
              <div className="text-center">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded skin"
                  className="mx-auto mb-4 rounded-lg max-w-sm"
                />
                <Button onClick={() => handleAnalysis(new FormData())} disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Start Analysis"}
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="results">
            {analysis && (
              <div className="space-y-6">
                <AnalysisResults analysis={analysis} />
                <RecommendationsDisplay recommendations={analysis.recommendations} />
              </div>
            )}
          </TabsContent>
          <TabsContent value="progress">
            <ProgressTracker progress={initialProgress} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

