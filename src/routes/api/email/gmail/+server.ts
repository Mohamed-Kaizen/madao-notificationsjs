import { error, json } from "@sveltejs/kit"
import nodemailer from "nodemailer"

import {
	PRIVATE_GMAIL_EMAIL,
	PRIVATE_GMAIL_PASSWORD,
} from "$env/static/private"

import type { RequestHandler } from "./$types"

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: PRIVATE_GMAIL_EMAIL,
		pass: PRIVATE_GMAIL_PASSWORD,
	},
})

interface EmailRequestBody {
	to: string
	subject: string
	text: string
	html?: string
	attachments?: {
		filename: string
		content: Buffer
		contentType: string
	}[]
}

export const POST: RequestHandler = async ({ request }) => {
	const form_data = await request.formData()

	const data: EmailRequestBody = {
		to: "",
		subject: "",
		text: "",
	}

	if (form_data.has("to")) data.to = form_data.get("to") as string
	else throw error(400, "Please provide valid `to` in request body")

	if (form_data.has("subject"))
		data.subject = form_data.get("subject") as string
	else throw error(400, "Please provide valid `subject` in request body")

	if (form_data.has("text")) data.text = form_data.get("text") as string
	else throw error(400, "Please provide valid `text` in request body")

	if (form_data.has("html")) data.html = form_data.get("html") as string

	if (form_data.has("attachments")) {
		const attachments = form_data.getAll("attachments") as File[]

		const _attachments = []

		for (const attachment of attachments) {
			_attachments.push({
				filename: attachment?.name,
				content: Buffer.from(await attachment?.arrayBuffer()),
				contentType: attachment?.type,
			})
		}
		data.attachments = _attachments
	}

	const response = await transporter.sendMail(data)

	return json({ response })
}
