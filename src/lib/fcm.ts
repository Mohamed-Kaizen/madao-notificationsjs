import admin from "firebase-admin"

import { PRIVATE_FIREBASE_CERT } from "$env/static/private"

import type { Messaging } from "firebase-admin/messaging"

let messaging: Messaging | null = null

if (PRIVATE_FIREBASE_CERT) {
	// prevent multiple initialization
	if (admin.apps.length === 0) {
		admin.initializeApp({
			credential: admin.credential.cert(
				JSON.parse(PRIVATE_FIREBASE_CERT)
			),
		})
	}

	messaging = admin.messaging()
}

export { messaging }
