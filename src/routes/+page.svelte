<script lang="ts">
	import FirebaseApp from "$lib/firebase"
	import { fcm } from "$lib/_fcm"

	const { token, error, is_supported, messaging, on_message } = fcm(
		FirebaseApp,
		{
			vapid_key:
				"BJJMbSVbonlmAROHGqWGsHFHbepDZaYjNH35A64b9tolCr3uqTlava0Ba0l5qij2j8KFCJHFy80f1DaUUGBfSpo",
			sw_path: "/sw/fcm.js",
		}
	)

	on_message((payload) => {
		console.log("on_message", payload)
	})

	$: console.log($token)
</script>

<h1>Welcome to SvelteKit</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
