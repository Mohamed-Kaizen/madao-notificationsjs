importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js")
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js")

const config = {
	apiKey: "AIzaSyAIIUlJDzRUoJQHWVV-s2kMqVGNgmzDOkM",
	authDomain: "madao-demo.firebaseapp.com",
	projectId: "madao-demo",
	storageBucket: "madao-demo.appspot.com",
	messagingSenderId: "278686388489",
	appId: "1:278686388489:web:210ea92b7ac614045243d8",
}

firebase.initializeApp(config)

const messaging = firebase.messaging()

// self.addEventListener("notificationclick", function (e) {
// 	clients.openWindow("https://svelte.dev")
// 	// const actions = [{"action":"viewAllNotifications","url":"https:\u002F\u002Flinkupaddis.com"},{"action":"viewSingleNotification","url":"https:\u002F\u002Flinkupaddis.com"}]
// 	// const action = actions.find(x => x.action === e.action)
// 	// const notification = e.notification

// 	// if (!action) return

// 	// if (action.url) {
// 	//   clients.openWindow(action.url)
// 	//   notification.close()
// 	// }
// })
self.addEventListener("push", function (event) {
	const payload = event.data.json()
	console.log("payload", payload)
	const title = payload.notification.title

	const body = payload.notification.body

	const icon = payload.notification.icon

	const click_action = payload.notification.click_action

	event.waitUntil(
		self.registration.showNotification(title, {
			subtitle: "subtitle",
			body: body,
			icon: icon,
			actions: [
				{
					action: "coffee-action",
					title: "Coffee",
					icon: icon,
				},
				{
					action: "doughnut-action",
					title: "Doughnut",
					icon: icon,
				},
				{
					action: "gramophone-action",
					title: "gramophone",
					icon: icon,
				},
				{
					action: "atom-action",
					title: "Atom",
					icon: icon,
				},
			],
			data: {
				click_action,
			},
		})
	)
})

self.addEventListener("notificationclick", function (event) {
	const click_action =
		event.notification.data.click_action ?? "https://svelte.dev"
	console.log("click_action", click_action)
	const redirect_url = event.notification.data.click_action
	event.notification.close()
	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then(function (clientList) {
				console.log(clientList)
				for (let i = 0; i < clientList.length; i++) {
					let client = clientList[i]
					if (client.url === "/" && "focus" in client) {
						return client.focus()
					}
				}
				if (clients.openWindow) {
					console.log(redirect_url)
					return clients.openWindow(redirect_url)
				}
			})
	)
})
