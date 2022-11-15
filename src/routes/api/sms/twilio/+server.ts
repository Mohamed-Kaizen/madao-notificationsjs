import { error, json } from "@sveltejs/kit"
import {
	PRIVATE_TWILIO_NUMBER,
	PRIVATE_TWILIO_SID,
	PRIVATE_TWILIO_TOKEN,
} from "$env/static/private"
import twilio from "twilio"

import type { RequestHandler } from "./$types"

interface RequestBody {
	message: string

	to: string

	from?: string
}

export const POST: RequestHandler = async ({ request }) => {
	const client = twilio(PRIVATE_TWILIO_SID, PRIVATE_TWILIO_TOKEN)

	const data: RequestBody = await request.json()

	const { message, to, from } = data

	if (!message) throw error(400, "Please provide `message` in request body")

	if (!to) throw error(400, "Please provide `to` in request body")
	try {
		const response = await client.messages.create({
			body: message,
			to,
			from: from || PRIVATE_TWILIO_NUMBER,
		})

		return json(response)
	} catch (e: any) {
		return json({ ...e, message: e.message })
	}
}
