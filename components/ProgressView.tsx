"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProgressViewProps {
  progress: {
    date: string
    score: number
    hydration: number
    texture: number
    clarity: number
  }[]
  onBack: () => void
}

export function ProgressView({ progress, onBack }: ProgressViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Skin Progress</h2>
        <p className="text-muted-foreground">Track how your skin health has improved over time</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Skin Health Score</CardTitle>
          <CardDescription>
            This score represents the overall health of your skin based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="comparison">Before & After</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Skin Metrics</CardTitle>
              <CardDescription>Track specific aspects of your skin health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="hydration" fill="#8884d8" name="Hydration" />
                    <Bar dataKey="texture" fill="#82ca9d" name="Texture" />
                    <Bar dataKey="clarity" fill="#ffc658" name="Clarity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Before & After Comparison</CardTitle>
              <CardDescription>Visual comparison of your skin's improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-center font-medium mb-2">First Analysis</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">First image will appear here</p>
                  </div>
                  <p className="text-center text-sm mt-2">Jan 1, 2023</p>
                </div>
                <div>
                  <h3 className="text-center font-medium mb-2">Latest Analysis</h3>
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">Latest image will appear here</p>
                  </div>
                  <p className="text-center text-sm mt-2">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

