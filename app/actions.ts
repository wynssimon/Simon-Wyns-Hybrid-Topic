"use server"

import { Novu } from "@novu/node"

let novuClient: Novu | null = null

function getNovuClient() {
  if (!novuClient) {
    if (!process.env.NOVU_API_KEY) {
      throw new Error("NOVU_API_KEY environment variable is not set")
    }
    novuClient = new Novu(process.env.NOVU_API_KEY)
  }
  return novuClient
}

type NotificationPayload = {
  type: "email" | "sms"
  to: string
  firstname: string
  payload: {
    subject?: string
    content: string
  }
}

export async function sendNotification(data: NotificationPayload) {
  try {
    const novu = getNovuClient()

    // Get the workflow ID based on notification type
    const workflowId = data.type === "email" ? process.env.NOVU_EMAIL_WORKFLOW_ID : process.env.NOVU_SMS_WORKFLOW_ID

    if (!workflowId) {
      return {
        success: false,
        error: `${data.type.toUpperCase()} workflow ID is not configured`,
      }
    }

    // Prepare subscriber (create if doesn't exist)
    const subscriberId = data.to.replace(/[^a-zA-Z0-9]/g, "")

    try {
      // Check if subscriber exists
      await novu.subscribers.get(subscriberId)
    } catch (error) {
      // Create subscriber if doesn't exist
      await novu.subscribers.identify(subscriberId, {
        email: data.type === "email" ? data.to : undefined,
        phone: data.type === "sms" ? data.to : undefined,
        firstName: data.firstname
      })
    }

    // Send the notification
    await novu.trigger(workflowId, {
      to: {
        subscriberId: subscriberId,
      },
      payload: {
        subject: data.payload.subject,
        content: data.payload.content,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("Error sending notification:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

