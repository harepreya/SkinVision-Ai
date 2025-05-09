import { CheckCircle, Camera, FileText, Phone } from "lucide-react"

interface StepsProps {
  currentStep: "capture" | "analyzing" | "results" | "consult"
}

export function Steps({ currentStep }: StepsProps) {
  const steps = [
    { id: "capture", label: "Capture", icon: Camera },
    { id: "analyzing", label: "Analyzing", icon: FileText },
    { id: "results", label: "Results", icon: CheckCircle },
    { id: "consult", label: "Consult", icon: Phone },
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep)
  }

  return (
    <div className="bg-muted p-4 relative">
      {/* Progress bar */}
      <div className="absolute h-1 bg-muted-foreground/20 bottom-0 left-0 right-0">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between">
        {steps.map((step, index) => {
          const currentIndex = getCurrentStepIndex()
          const isActive = step.id === currentStep
          const isCompleted = index < currentIndex
          const StepIcon = step.icon

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"
              }`}
            >
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-colors
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-primary/20 dark:bg-primary/30"
                        : "bg-muted-foreground/20 dark:bg-muted-foreground/10"
                  }
                `}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

