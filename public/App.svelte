<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import FileTransfer from './views/FileTransfer.svelte';
  import Rooms from './views/Rooms.svelte';
  import NewUser from './views/NewUser.svelte';

  let registered = Boolean(window.localStorage.getItem('blaze'));

  function handleOffline() {
    if (navigator.onLine) return;

    // Redirect user to home page when user goes offline
    navigate('/app', { replace: true });
  }

</script>

<svelte:window on:offline={handleOffline} />
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