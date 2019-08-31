<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
  let username = '';

  function registerUser() {

    localStorage.setItem('blaze', JSON.stringify({
      user: {
        name: username
      },
      rooms: []
    }));

    dispatch('registered');
  }

</script>

<div id="app" class="center-center">

  <form on:submit|preventDefault={registerUser} class="new-user">
    <input
      required
      type="text"
      placeholder="Cool nickname"
      maxlength="10"
      aria-label="Enter a nickname"
      bind:value={username}
    >
    <button type="submit" class="wide">
      Continue
    </button>
  </form>


</div>