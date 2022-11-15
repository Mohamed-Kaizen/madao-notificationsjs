import { error, json } from "@sveltejs/kit"

import { messaging } from "$lib/fcm"

import type { RequestHandler } from "./$types"

interface PushNotificationRequestBody {
	tokens: string[]

	payload: object
}

export const POST: RequestHandler = async ({ request }) => {
	if (!messaging)
		throw error(400, "Please add PRIVATE_FIREBASE_CERT to your .env file")

	const data: PushNotificationRequestBody = await request.json()

	const tokens = data.tokens

	const payload = data.payload

	let success = 0

	let failure = 0

	const failures: object[] = []

	if (!tokens || tokens.length === 0)
		throw error(400, "Please provide valid `tokens` in request body")

	function chunk(arr: string[], chunk_size: number) {
		const results = []

		while (arr.length) {
			results.push(arr.splice(0, chunk_size))
		}

		return results
	}

	const chunks = chunk(tokens, 400)

	for (const chunk of chunks) {
		const response = await messaging.sendMulticast({
			tokens: chunk,
			...payload,
		})

		success += response.successCount

		failure += response.failureCount

		if (response.failureCount > 0) {
			response.responses.forEach((resp, idx) => {
				if (!resp.success) {
					failures.push({
						error: resp.error?.message,
						token: chunk[idx],
					})
				}
			})
		}
	}

	return json({
		success,
		failure,
		failures,
	})
}
