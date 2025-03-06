import NotificationDemo from "@/components/notification-demo"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Novu meldingen Demo</h1>
      <p className="text-muted-foreground mb-8">
          Via deze applicatie kan u testen hoe je automatische sms'en en emails stuurt met Novu
      </p>
      <NotificationDemo />
    </main>
  )
}

