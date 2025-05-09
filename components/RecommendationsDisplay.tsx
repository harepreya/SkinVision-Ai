import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface RecommendationsDisplayProps {
  recommendations: {
    routine: string[]
    products: string[]
    lifestyle: string[]
  }
}

export default function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        <CardDescription>Based on your skin analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="routine">
            <AccordionTrigger>Skincare Routine</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal pl-5 space-y-2">
                {recommendations.routine.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="products">
            <AccordionTrigger>Recommended Products</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.products.map((product, index) => (
                  <li key={index}>{product}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="lifestyle">
            <AccordionTrigger>Lifestyle Tips</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.lifestyle.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

