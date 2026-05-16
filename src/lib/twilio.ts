'use server'

import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!accountSid || !authToken) {
    console.error('Twilio credentials not configured')
    return { success: false, error: 'Twilio not configured' }
  }

  try {
    const client = twilio(accountSid, authToken)

    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: `whatsapp:+${to.replace(/\D/g, '')}`
    })

    console.log('WhatsApp message sent:', result.sid)
    return { success: true, sid: result.sid }
  } catch (err: any) {
    console.error('Twilio error:', err.message)
    return { success: false, error: err.message }
  }
}
