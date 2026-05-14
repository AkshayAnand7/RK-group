'use server'

import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER

const client = twilio(accountSid, authToken)

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      from: fromNumber, // e.g., 'whatsapp:+14155238886'
      to: `whatsapp:${to}` // e.g., 'whatsapp:+919809207080'
    })
    console.log('WhatsApp message sent:', response.sid)
    return { success: true, sid: response.sid }
  } catch (error: any) {
    console.error('Twilio Error:', error.message)
    return { success: false, error: error.message }
  }
}
