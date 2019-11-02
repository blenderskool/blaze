<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
  export let text, id, icon, disabled = false;
</script>


<button
  class="fab"
  id={id}
  aria-label={text}
  on:click={e => dispatch('click', e)}
  disabled={disabled}
>
  <span class={icon} />
  <div class="lg-text">
    {text}
  </div>
  <slot />
</button>