"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, FileText, CheckCircle, Phone, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
  isFirstVisit: boolean
}

export default function WelcomeScreen({ onStart, isFirstVisit }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const onboardingSteps = [
    {
      title: "Capture Your Skin",
      description: "Take a clear photo of your face or upload an existing image",
      icon: Camera,
    },
    {
      title: "AI Analysis",
      description: "Our advanced AI analyzes your skin type, concerns, and needs",
      icon: FileText,
    },
    {
      title: "Get Results",
      description: "Receive personalized skincare recommendations and insights",
      icon: CheckCircle,
    },
    {
      title: "Expert Consultation",
      description: "Optionally connect with a dermatologist for professional advice",
      icon: Phone,
    },
  ]

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onStart()
    }
  }

  // Get the current step's icon component
  const CurrentStepIcon = onboardingSteps[currentStep].icon

  return (
    <Card className="overflow-hidden shadow-lg border-primary/10 dark:border-primary/20">
      <CardHeader className="text-center pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-3xl">Welcome to AI Skin Advisor</CardTitle>
        <CardDescription className="text-lg">Your personal skin analysis and recommendation system</CardDescription>
      </CardHeader>

      {isFirstVisit ? (
        <>
          <CardContent className="p-6 pb-2">
            <div className="flex justify-between mb-8 relative">
              {onboardingSteps.map((step, index) => {
                const StepIcon = step.icon
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center z-10 ${
                      index === currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2
                        ${index === currentStep ? "bg-primary text-primary-foreground" : "bg-muted"}
                        transition-all duration-300
                      `}
                    >
                      <StepIcon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-center max-w-[100px]">{step.title}</span>
                  </div>
                )
              })}

              {/* Progress line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-muted-foreground/20">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-in-out"
                  style={{ width: `${(currentStep / (onboardingSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CurrentStepIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{onboardingSteps[currentStep].title}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{onboardingSteps[currentStep].description}</p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between p-6 bg-muted/30">
            <Button variant="outline" onClick={onStart}>
              Skip Tour
            </Button>
            <Button onClick={handleNextStep} className="bg-primary hover:bg-primary/90">
              {currentStep < onboardingSteps.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2 w-4 h-4" />
                </>
              ) : (
                "Get Started"
              )}
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="p-6">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-primary" />
                    Skin Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Advanced AI technology analyzes your skin type, texture, and concerns
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                    Personalized Recommendations
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get tailored skincare routines and product suggestions
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    Dermatologist Consultation
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Connect with certified dermatologists for professional advice
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg hover:bg-muted/70 transition-colors">
                  <h3 className="font-medium flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    Detailed Reports
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Save and download comprehensive skin analysis reports
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg" onClick={onStart} className="bg-primary hover:bg-primary/90 px-8">
                  Start Skin Analysis
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="how-it-works" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <span className="font-medium text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Capture or Upload a Photo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Take a clear photo of your face using your device's camera or upload an existing image. For best
                      results, use natural lighting and avoid makeup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <span className="font-medium text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Our advanced AI analyzes over 25 different skin parameters to determine your skin type, identify
                      concerns, and assess overall skin health.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <span className="font-medium text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Review Results</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Get detailed insights about your skin type, concerns, and personalized recommendations for
                      skincare routines and products.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5 shrink-0">
                    <span className="font-medium text-primary">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Optional Consultation</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with a certified dermatologist for professional advice and personalized treatment options
                      based on your analysis results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button size="lg" onClick={onStart} className="bg-primary hover:bg-primary/90 px-8">
                  Start Skin Analysis
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  )
}

