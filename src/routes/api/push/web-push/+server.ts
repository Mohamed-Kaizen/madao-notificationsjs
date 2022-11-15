import { error, json } from "@sveltejs/kit"
import webpush from "web-push"

import {
	PRIVATE_WEB_PUSH_KEY,
	PRIVATE_WEB_PUSH_EMAIL,
} from "$env/static/private"
import { PUBLIC_WEB_PUSH_KEY } from "$env/static/public"

import type { RequestHandler } from "./$types"

interface PushNotification {
	title: string

	body: string

	icon: string

	image: string

	badge: string

	tag: string

	dir: "auto" | "ltr" | "rtl"

	vibrate: number[]

	timestamp: number

	renotify: boolean

	requireInteraction: boolean

	silent: boolean

	persistent: boolean

	sticky: boolean

	notificationCloseEvent: boolean

	showTrigger: boolean

	actions: {
		action: string

		title: string

		icon: string
	}[]

	data: Record<string, unknown>
}

interface PushNotificationRequestBody {
	tokens: string[]

	payload: PushNotification
}

webpush.setVapidDetails(
	`mailto:${PRIVATE_WEB_PUSH_EMAIL}`,
	PUBLIC_WEB_PUSH_KEY,
	PRIVATE_WEB_PUSH_KEY
)

export const POST: RequestHandler = async ({ request }) => {
	const data: PushNotificationRequestBody = await request.json()

	const tokens = data.tokens

	if (!tokens || tokens.length === 0)
		throw error(400, "Please provide valid `tokens` in request body")

	const payload = JSON.stringify({ ...data.payload })

	try {
		const promises = tokens.map((token) => {
			const _token: webpush.PushSubscription = JSON.parse(
				Buffer.from(token, "base64").toString("utf-8")
			)
			return webpush.sendNotification(_token, payload)
		})

		await Promise.all(promises)

		return json({ success: true })
	} catch (err: any) {
		return new Response(err.message, {
			status: 400,
		})
	}
}
