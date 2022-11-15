<script lang="ts">
	let f = ""
	import { PUBLIC_WEB_PUSH_KEY } from "$env/static/public"
	function urlBase64ToUint8Array(base64String: string) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
		const base64 = (base64String + padding)
			.replace(/\-/g, "+")
			.replace(/_/g, "/")

		const rawData = window.atob(base64)
		const outputArray = new Uint8Array(rawData.length)

		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i)
		}
		return outputArray
	}
	async function send() {
		let register =
			(await navigator.serviceWorker.getRegistration(
				"/sw/web-push.js"
			)) ?? (await navigator.serviceWorker.register("/sw/web-push.js"))

		await new Promise((resolve) => setTimeout(resolve, 100))

		let subscription =
			(await register.pushManager.getSubscription()) ??
			(await register.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey:
					urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY),
			}))

		let base64 = btoa(JSON.stringify(subscription))
		f = base64
		console.log(base64)
		// decode base64
		let decoded = JSON.parse(atob(base64))
		console.log(decoded)
		// // send the subscription to the server
		// await fetch("/api/push/web-push/", {
		// 	method: "POST",
		// 	body: JSON.stringify({ tokens: [subscription] }),
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// })

		// const subscription = await register.pushManager.subscribe({
		// 	userVisibleOnly: true,
		// 	applicationServerKey: urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY),
		// })
		// console.log(subscription)

		// navigator.serviceWorker.ready
		// 	.then((registration) => {
		// 		// registration.pushManager
		// 		// 	.getSubscription()
		// 		// 	.then(async (subscriptionl) => {
		// 		// 		console.log("registration")
		// 		// 		// if (subscription) {
		// 		// 		//     console.log(subscription)
		// 		// 		//     return
		// 		// 		// }
		// 		// 		// const subscription = await registration.pushManager.subscribe({
		// 		// 		//     userVisibleOnly: true,
		// 		// 		//     applicationServerKey: urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY),
		// 		// 		// })
		// 		// 		// console.log(subscription)
		// 		// 	})
		// 		alert("ready")
		// 		console.log("registration")
		// 		// const subscription = await registration.pushManager.subscribe({
		// 		//     userVisibleOnly: true,
		// 		//     applicationServerKey: urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY),
		// 		// })
		// 		// console.log(subscription)
		// 		// const response = await fetch("/api/web-push/subscribe", {
		// 		//     method: "POST",
		// 		//     headers: {
		// 		//         "Content-Type": "application/json",
		// 		//     },
		// 		//     body: JSON.stringify(subscription),
		// 		// })
		// 		// console.log(response)
		// 	})
		// 	.catch((err) => {
		// 		console.log("err")
		// 	})
		// // console.log(registration)
		// // const subscription = await register.pushManager.subscribe({
		// // 	userVisibleOnly: true,

		// // 	//public vapid key
		// // 	applicationServerKey: urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY),
		// // })

		// console.log(subscription)
	}
	if (typeof window !== "undefined" && "serviceWorker" in navigator) {
		send()
	}
</script>

{#if typeof window !== "undefined"}
	<h1>{urlBase64ToUint8Array(PUBLIC_WEB_PUSH_KEY)}</h1>
{/if}
{PUBLIC_WEB_PUSH_KEY}
