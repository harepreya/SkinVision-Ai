import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AnalysisResultsProps {
  analysis: {
    skinType: string
    concerns: string[]
  }
}

export default function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skin Analysis Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Skin Type:</h3>
          <Badge variant="secondary" className="text-lg">
            {analysis.skinType}
          </Badge>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Identified Concerns:</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.concerns.map((concern, index) => (
              <Badge key={index} variant="outline">
                {concern}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

