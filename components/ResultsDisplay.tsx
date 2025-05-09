"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Phone, Download, Share2, Bookmark, BookmarkCheck, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ResultsDisplayProps {
  results: {
    skinType: string
    concerns: string[]
    recommendations: {
      routine: string[]
      products: string[]
      lifestyle: string[]
    }
    explanation: {
      skinType: string
      concerns: Record<string, string>
    }
  }
  imageData: string | null
  onConsultDermatologist: () => void
  onStartOver: () => void
}

export function ResultsDisplay({ results, imageData, onConsultDermatologist, onStartOver }: ResultsDisplayProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [showBeforeAfter, setShowBeforeAfter] = useState(false)
  const [showAllConcerns, setShowAllConcerns] = useState(false)
  const [skinConcernPriority, setSkinConcernPriority] = useState<Record<string, number>>(
    results.concerns.reduce(
      (acc, concern, index) => {
        acc[concern] = 5 - (index % 5) // Priority from 5 (highest) to 1 (lowest)
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const prioritizedConcerns = [...results.concerns].sort(
    (a, b) => (skinConcernPriority[b] || 0) - (skinConcernPriority[a] || 0),
  )

  const displayedConcerns = showAllConcerns ? prioritizedConcerns : prioritizedConcerns.slice(0, 3)

  const handleSaveResults = () => {
    setIsSaved(!isSaved)
    // In a real app, you would save the results to the user's account
  }

  const handleShareResults = () => {
    // In a real app, you would implement sharing functionality
    alert("Sharing functionality would be implemented here")
  }

  const handleDownloadResults = () => {
    // In a real app, you would generate and download a PDF report
    alert("Download functionality would be implemented here")
  }

  const handleConcernPriorityChange = (concern: string, value: number[]) => {
    setSkinConcernPriority((prev) => ({
      ...prev,
      [concern]: value[0],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Skin Analysis Results</h2>
        <p className="text-muted-foreground">Based on your image, we've analyzed your skin type and concerns</p>
      </div>

      <div className="flex justify-end space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleSaveResults}>
                {isSaved ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                {isSaved ? "Saved" : "Save"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSaved ? "Remove from saved results" : "Save this analysis to your profile"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleShareResults}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share these results with a dermatologist or friend</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleDownloadResults}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download a PDF report of your analysis</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Your Skin Image</span>
              <div className="flex items-center">
                <Switch
                  id="before-after"
                  checked={showBeforeAfter}
                  onCheckedChange={setShowBeforeAfter}
                  className="mr-2"
                />
                <Label htmlFor="before-after" className="text-sm font-normal">
                  Show comparison
                </Label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showBeforeAfter ? (
              <div className="rounded-lg overflow-hidden">
                <img src={imageData || "/placeholder.svg"} alt="Analyzed skin" className="w-full object-cover" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={imageData || "/placeholder.svg"}
                      alt="Current skin"
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Current</p>
                </div>
                <div className="space-y-1">
                  <div className="rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                    <p className="text-sm text-muted-foreground p-4 text-center">
                      Future comparison will appear here after follow-up analysis
                    </p>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Future</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Skin Type</h3>
              <div className="flex items-center">
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {results.skinType}
                </Badge>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">More info</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">About {results.skinType} Skin</h4>
                      <p className="text-sm">{results.explanation.skinType}</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="mt-2 text-sm">{results.explanation.skinType}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-muted-foreground">Skin Concerns</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setShowAllConcerns(!showAllConcerns)}
                >
                  {showAllConcerns ? (
                    <>
                      Show Less <ChevronUp className="ml-1 h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show All <ChevronDown className="ml-1 h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {displayedConcerns.map((concern, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-normal">
                        {concern}
                      </Badge>
                      <span className="text-xs text-muted-foreground">Priority: {skinConcernPriority[concern]}/5</span>
                    </div>
                    <Slider
                      value={[skinConcernPriority[concern] || 3]}
                      min={1}
                      max={5}
                      step={1}
                      onValueChange={(value) => handleConcernPriorityChange(concern, value)}
                    />
                  </div>
                ))}

                {!showAllConcerns && results.concerns.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{results.concerns.length - 3} more concerns
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="explanation">Detailed Explanation</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your skin analysis and concern priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="routine">
                  <AccordionTrigger>Daily Skincare Routine</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-5 space-y-2">
                      {results.recommendations.routine.map((step, index) => (
                        <li key={index} className="pl-1">
                          <div className="flex items-start">
                            <span>{step}</span>
                            {index === 0 && (
                              <Badge className="ml-2 bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:bg-green-900/20 dark:text-green-400">
                                Essential
                              </Badge>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="products">
                  <AccordionTrigger>Recommended Products</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {results.recommendations.products.map((product, index) => (
                        <li key={index} className="pl-1">
                          {product}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <Info className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                        Product recommendations are based on your skin type and concerns. Always patch test new products
                        before adding them to your routine.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lifestyle">
                  <AccordionTrigger>Lifestyle Tips</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {results.recommendations.lifestyle.map((tip, index) => (
                        <li key={index} className="pl-1">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 bg-muted/30 border-t rounded-b-lg">
              <p className="text-sm text-muted-foreground">
                Recommendations are updated based on your concern priorities
              </p>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="w-4 h-4 mr-2" />
                Print Routine
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="explanation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Your Skin</CardTitle>
              <CardDescription>Detailed explanation of your skin analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">About Your {results.skinType} Skin Type</h3>
                <p>{results.explanation.skinType}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">About Your Skin Concerns</h3>
                {prioritizedConcerns.map((concern, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center">
                      <h4 className="font-medium">{concern}</h4>
                      <Badge className="ml-2" variant="outline">
                        Priority: {skinConcernPriority[concern]}/5
                      </Badge>
                    </div>
                    <p>{results.explanation.concerns[concern]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-1">Need Professional Advice?</h3>
              <p className="text-muted-foreground">Consult with a certified dermatologist about your skin concerns</p>
            </div>
            <Button onClick={onConsultDermatologist} className="w-full md:w-auto">
              <Phone className="w-4 h-4 mr-2" />
              Consult a Dermatologist
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onStartOver}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Another Photo
        </Button>
      </div>
    </div>
  )
}

