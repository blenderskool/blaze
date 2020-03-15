<script>
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const modifyBorder = style => e => { e.target.style.border = style };

  function dropHandler(e) {
    const files = e.dataTransfer.files;
    modifyBorder('none')(e);

    if (files != null) {
      dispatch(files, 'files');
    }
  }
</script>


<div
  class="dropzone"
  on:drop|preventDefault={dropHandler}
  on:dragover|preventDefault={modifyBorder('solid')}
  on:dragleave|preventDefault={modifyBorder('none')}
/>