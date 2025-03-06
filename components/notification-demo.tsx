"use client"

import type React from "react"

import {useState} from "react"
import {Bell, Mail, MessageSquare, Send} from "lucide-react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {useToast} from "@/components/ui/use-toast"
import {sendNotification} from "@/app/actions"

export default function NotificationDemo() {
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)
    const [emailData, setEmailData] = useState({
        to: "",
        firstname: "",
        subject: "Test mail",
        content: "Super! U stuurde net een geautomatiseerde email met Novu!",
    })
    const [smsData, setSmsData] = useState({
        to: "",
        firstname: "",
        content: "Super! U stuurde net een geautomatiseerde SMS met Novu!",
    })

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await sendNotification({
                type: "email",
                to: emailData.to,
                firstname: emailData.firstname,
                payload: {
                    subject: emailData.subject,
                    content: emailData.content,
                },
            })

            if (result.success) {
                toast({
                    title: "Email verzonden",
                    description: `naar ${emailData.to}`,
                })
            } else {
                toast({
                    title: "Er ging iets mis bij het sturen van de email",
                    description: result.error || "Onbekende error",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Er ging iets mis bij het sturen van de email",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSmsSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await sendNotification({
                type: "sms",
                to: smsData.to,
                firstname: smsData.firstname,
                payload: {
                    content: smsData.content,
                },
            })

            if (result.success) {
                toast({
                    title: "SMS verzonden",
                    description: `naar ${smsData.to}`,
                })
            } else {
                toast({
                    title: "Er ging iets mis bij het sturen van de sms",
                    description: result.error || "Onbekende error",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Er ging iets mis bij het sturen van de sms",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5"/>
                    Notification Sender
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">
                            <Mail className="h-4 w-4 mr-2"/>
                            Email
                        </TabsTrigger>
                        <TabsTrigger value="sms">
                            <MessageSquare className="h-4 w-4 mr-2"/>
                            SMS
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email">
                        <form onSubmit={handleEmailSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="email-to">Email</Label>
                                <Input
                                    id="email-to"
                                    type="email"
                                    placeholder="test@test.com"
                                    value={emailData.to}
                                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-to">Voornaam</Label>
                                <Input
                                    id="firstname"
                                    type="text"
                                    placeholder="Jan Janssens"
                                    value={emailData.firstname}
                                    onChange={(e) => setEmailData({...emailData, firstname: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email-subject">Onderwerp</Label>
                                <Input
                                    id="email-subject"
                                    placeholder="Email subject"
                                    value={emailData.subject}
                                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email-content">Content</Label>
                                <Textarea
                                    id="email-content"
                                    placeholder="Email content"
                                    rows={4}
                                    value={emailData.content}
                                    onChange={(e) => setEmailData({...emailData, content: e.target.value})}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">Sending...</span>
                                ) : (
                                    <span className="flex items-center gap-2">
                    <Send className="h-4 w-4"/>
                    Stuur mail
                  </span>
                                )}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="sms">
                        <form onSubmit={handleSmsSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="sms-to">GSM nummer</Label>
                                <Input
                                    id="sms-to"
                                    type="tel"
                                    placeholder="+3234567890"
                                    value={smsData.to}
                                    onChange={(e) => setSmsData({...smsData, to: e.target.value})}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Met de land code! (vb +32)</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email-to">Voornaam</Label>
                                <Input
                                    id="firstname"
                                    type="text"
                                    placeholder="Jan Janssens"
                                    value={smsData.firstname}
                                    onChange={(e) => setSmsData({...smsData, firstname: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sms-content">Bericht</Label>
                                <Textarea
                                    id="sms-content"
                                    placeholder="SMS message content"
                                    rows={4}
                                    value={smsData.content}
                                    onChange={(e) => setSmsData({...smsData, content: e.target.value})}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">Sending...</span>
                                ) : (
                                    <span className="flex items-center gap-2">
                    <Send className="h-4 w-4"/>
                    Stuur SMS
                  </span>
                                )}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
                <p className="text-sm text-muted-foreground">
                    © 2025
                </p>
            </CardFooter>
        </Card>
    )
}

