"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, AlertCircle } from "lucide-react"
import RecommendationsDisplay from "./RecommendationsDisplay"

interface SkinAnalyzerProps {
  analyzeAction: (formData: FormData) => Promise<{
    skinType: string
    concerns: string[]
    recommendations: {
      routine: string[]
      products: string[]
      lifestyle: string[]
    }
  }>
}

export default function SkinAnalyzer({ analyzeAction }: SkinAnalyzerProps) {
  const [image, setImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        const imageUrl = URL.createObjectURL(file)
        setImage(imageUrl)
        setAnalysis(null)
        setError(null)
        setIsLoading(true)

        const formData = new FormData()
        formData.append("image", file)

        try {
          const result = await analyzeAction(formData)
          setAnalysis(result)
        } catch (error) {
          console.error("Error analyzing image:", error)
          setError("Error analyzing image. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
    },
    [analyzeAction],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "image/*": [] } })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skin Analysis</CardTitle>
        <CardDescription>Upload a clear facial image for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p>Drag and drop an image here, or click to select a file</p>
              <Button>Select Image</Button>
            </div>
          )}
        </div>
        {image && (
          <div className="mt-8">
            <Image
              src={image || "/placeholder.svg"}
              alt="Uploaded skin"
              width={300}
              height={300}
              className="rounded-lg mx-auto"
            />
          </div>
        )}
        {isLoading && <p className="mt-4 text-center">Analyzing image...</p>}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {analysis && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <p>
              <strong>Skin Type:</strong> {analysis.skinType}
            </p>
            <p>
              <strong>Concerns:</strong> {analysis.concerns.join(", ")}
            </p>
            <RecommendationsDisplay recommendations={analysis.recommendations} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

