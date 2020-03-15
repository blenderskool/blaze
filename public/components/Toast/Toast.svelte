<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  export let duration = 4000;
  export let message = 'This is a toast';
  let visible = true;
  const fadeDuration = 200;

  // Play the fadeOut transition before the Toast is unmounted
  onMount(() => {

    setTimeout(() => {
      visible = false;
    }, duration - fadeDuration);
  });
</script>

{#if visible}
  <div transition:fade="{{ duration: fadeDuration }}" class="toast">
    {message}
  </div>
{/if}