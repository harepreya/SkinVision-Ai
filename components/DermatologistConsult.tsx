"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Phone, MessageSquare, MapPin } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"

interface DermatologistConsultProps {
  onBack: () => void
  skinType?: string
  concerns?: string[]
}

export function DermatologistConsult({ onBack, skinType, concerns }: DermatologistConsultProps) {
  const [consultType, setConsultType] = useState("call")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const MotionButton = motion(Button)

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MotionButton variant="ghost" size="sm" onClick={onBack} whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </MotionButton>
      </motion.div>

      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold">Consult a Dermatologist</h2>
        <p className="text-muted-foreground">Get professional advice for your skin concerns</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={consultType} onValueChange={setConsultType} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="call">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Call
                </TabsTrigger>
                <TabsTrigger value="message">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </TabsTrigger>
                <TabsTrigger value="inperson">
                  <MapPin className="w-4 h-4 mr-2" />
                  In-Person
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <motion.div
                  key={consultType}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="call" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Schedule a Phone Consultation</CardTitle>
                        <CardDescription>Speak directly with a dermatologist about your skin concerns</CardDescription>
                      </CardHeader>
                      <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="Enter your full name" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="Enter your phone number" required type="tel" />
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Date</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Input type="date" required min={new Date().toISOString().split("T")[0]} />
                              </div>
                              <div>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="morning">Morning (9AM - 12PM)</SelectItem>
                                    <SelectItem value="afternoon">Afternoon (1PM - 5PM)</SelectItem>
                                    <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="concerns">Your Skin Concerns</Label>
                            <Textarea
                              id="concerns"
                              placeholder="Describe your skin concerns in detail"
                              rows={4}
                              defaultValue={
                                skinType && concerns ? `Skin Type: ${skinType}\nConcerns: ${concerns.join(", ")}` : ""
                              }
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <MotionButton
                            type="submit"
                            className="w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Schedule Call
                          </MotionButton>
                        </CardFooter>
                      </form>
                    </Card>
                  </TabsContent>

                  <TabsContent value="message" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Message a Dermatologist</CardTitle>
                        <CardDescription>Send your questions and get a response within 24 hours</CardDescription>
                      </CardHeader>
                      <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name-msg">Full Name</Label>
                            <Input id="name-msg" placeholder="Enter your full name" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" placeholder="Enter your email address" required type="email" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea
                              id="message"
                              placeholder="Type your questions or concerns here"
                              rows={6}
                              defaultValue={
                                skinType && concerns
                                  ? `Skin Type: ${skinType}\nConcerns: ${concerns.join(", ")}\n\nMy questions:`
                                  : ""
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Response Priority</Label>
                            <RadioGroup defaultValue="standard">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="standard" id="standard" />
                                <Label htmlFor="standard">Standard (24 hours)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="urgent" id="urgent" />
                                <Label htmlFor="urgent">Urgent (4 hours, additional fee)</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <MotionButton
                            type="submit"
                            className="w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Send Message
                          </MotionButton>
                        </CardFooter>
                      </form>
                    </Card>
                  </TabsContent>

                  <TabsContent value="inperson" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Book an In-Person Appointment</CardTitle>
                        <CardDescription>Visit one of our partner dermatology clinics</CardDescription>
                      </CardHeader>
                      <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name-visit">Full Name</Label>
                            <Input id="name-visit" placeholder="Enter your full name" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone-visit">Phone Number</Label>
                            <Input id="phone-visit" placeholder="Enter your phone number" required type="tel" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Select Location</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select clinic location" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="downtown">Downtown Clinic</SelectItem>
                                <SelectItem value="north">North Medical Center</SelectItem>
                                <SelectItem value="east">East Side Dermatology</SelectItem>
                                <SelectItem value="west">West End Skin Care</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Appointment Date & Time</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Input type="date" required min={new Date().toISOString().split("T")[0]} />
                              </div>
                              <div>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="9am">9:00 AM</SelectItem>
                                    <SelectItem value="10am">10:00 AM</SelectItem>
                                    <SelectItem value="11am">11:00 AM</SelectItem>
                                    <SelectItem value="1pm">1:00 PM</SelectItem>
                                    <SelectItem value="2pm">2:00 PM</SelectItem>
                                    <SelectItem value="3pm">3:00 PM</SelectItem>
                                    <SelectItem value="4pm">4:00 PM</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="visit-reason">Reason for Visit</Label>
                            <Textarea
                              id="visit-reason"
                              placeholder="Briefly describe why you're seeking a consultation"
                              rows={4}
                              defaultValue={
                                skinType && concerns ? `Skin Type: ${skinType}\nConcerns: ${concerns.join(", ")}` : ""
                              }
                            />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <MotionButton
                            type="submit"
                            className="w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Book Appointment
                          </MotionButton>
                        </CardFooter>
                      </form>
                    </Card>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-8 text-center space-y-4">
                <motion.div
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.8, 1] }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <motion.h3
                  className="text-xl font-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Consultation Request Submitted!
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  {consultType === "call" && "We'll call you to confirm your phone consultation."}
                  {consultType === "message" &&
                    "A dermatologist will respond to your message within the selected timeframe."}
                  {consultType === "inperson" &&
                    "Your in-person appointment has been scheduled. We'll send a confirmation shortly."}
                </motion.p>
                <motion.div
                  className="pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <MotionButton onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Return to Results
                  </MotionButton>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Our Dermatologists</CardTitle>
            <CardDescription>Certified skin care professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Dr. Sarah Johnson", specialty: "Cosmetic Dermatology" },
                { name: "Dr. Michael Chen", specialty: "Clinical Dermatology" },
                { name: "Dr. Amara Patel", specialty: "Pediatric Dermatology" },
              ].map((doctor, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center text-center p-4 border rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

