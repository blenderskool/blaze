<script>

	import { Router, Route } from 'svelte-routing';
	import FileTransfer from './views/FileTransfer.svelte';
	import Rooms from './views/Rooms.svelte';
	import NewUser from './views/NewUser.svelte';

	let registered = Boolean(window.localStorage.getItem('blaze'));

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