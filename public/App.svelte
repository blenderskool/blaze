<script>
	import { onMount } from 'svelte';
	import { Router, Route, navigate } from 'svelte-routing';
	import FileTransfer from './views/FileTransfer.svelte';
	import Rooms from './views/Rooms.svelte';
	import NewUser from './views/NewUser.svelte';

	let registered = Boolean(window.localStorage.getItem('blaze'));

	onMount(() => {

		function handleOffline() {
			if (navigator.onLine) return;

			// Redirect user to home page when user goes offline
			navigate('/app', { replace: true });
		}

		window.addEventListener('offline', handleOffline);

		// Remove the listener
		return () => window.removeEventListener('offline', handleOffline);
	});

</script>

<Router>

	<!-- /app - Recent Rooms -->
	<Route path="/app">
		{#if !registered}
			<NewUser on:registered={() => registered = true} />
		{:else}
			<Rooms />
		{/if}
	</Route>

	<!-- /app/t/:room-name - Joined a room -->
	<Route path="/app/t/:room">
		{#if !registered}
			<NewUser on:registered={() => registered = true} />
		{:else}
			<FileTransfer />
		{/if}
	</Route>

</Router>