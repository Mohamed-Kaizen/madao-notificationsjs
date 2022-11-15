import { get, writable } from "svelte/store"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

import type { FirebaseApp } from "firebase/app"
import type { GetTokenOptions, Messaging } from "firebase/messaging"

interface FcmOptions {
	vapid_key?: string

	sw_path?: string
}

export function fcm(firebase: FirebaseApp, options: FcmOptions = {}) {
	const { vapid_key, sw_path } = options

	const token = writable<string | null>(null)

	const error = writable<Error | null>(null)

	const is_supported = writable<boolean>(false)

	const messaging = writable<Messaging | null>(null)

	let sw: any

	async function init() {
		if (sw_path) {
			try {
				sw = await navigator.serviceWorker.register(sw_path)
			} catch {
				error.set(new Error("Service worker registration failed"))
			}
		}

		const token_options: GetTokenOptions = {
			vapidKey: vapid_key,
			serviceWorkerRegistration: sw,
		}

		const _messaging = get(messaging)

		if (_messaging) {
			try {
				const _token = await getToken(_messaging, token_options)
				token.set(_token)
			} catch (e: any) {
				error.set(e)
			}
		}
	}

	if (typeof window !== "undefined") {
		messaging.set(getMessaging(firebase))

		if (!messaging) {
			is_supported.set(false)
			error.set(new Error("Firebase Messaging is not supported"))
		}

		is_supported.set(true)

		init()
	}

	function on_message(fn: (payload: unknown) => void) {
		const _messaging = get(messaging)

		if (_messaging) onMessage(_messaging, fn)
	}

	return { token, error, is_supported, messaging, on_message }
}
