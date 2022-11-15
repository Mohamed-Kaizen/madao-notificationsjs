import { PRIVATE_SECRET_KEY } from "$env/static/private"

import type { Handle } from "@sveltejs/kit"

export const handle: Handle = async ({ event, resolve }) => {
	const api_key = event.request.headers.get("x-api-key")
	if (api_key !== PRIVATE_SECRET_KEY) {
		return new Response("Unauthorized", {
			status: 401,
		})
	}

	const response = await resolve(event)

	return response
}
