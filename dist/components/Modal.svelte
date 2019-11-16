<script>
  import { fade } from 'svelte/transition';

  export let isOpen = true;
  export let isClosable = true;

  // Blur the rest of the app when modal is displayed
  function blurApp(isOpen) {
    const app = document.getElementById('app');
    
    if (app)
      app.style.filter = isOpen ? 'blur(18px)' : '';
      document.body.classList.toggle('no-bg-image', isOpen);
  }

  /**
   * Closes the modal when ESC key is pressed
   */
  function keyHandler(e) {
    if (e.keyCode === 27 || e.which === 27) {
      isOpen = false;
    }
  }

  $: blurApp(isOpen);

</script>

<svelte:window on:keydown={keyHandler} />
{#if isOpen}
  <div class="modal-wrapper" transition:fade="{{ duration: 200 }}">

    {#if isClosable}
      <button
        class="thin icon icon-cancel"
        aria-label="Close Modal"
        on:click={() => isOpen = false}
        on:keydown={e => {if (e.which === 13) isOpen = false;} }
      />
    {/if}

    <div class="modal">
      <slot />
    </div>
  </div>
{/if}