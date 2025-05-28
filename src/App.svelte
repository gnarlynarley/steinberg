<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import createImage from './lib/utils/createImage';
  import applyFloydSteinberg from './lib/utils/applyFloydSteinberg';
  import Color from './lib/utils/Color';
  import DropZone from './lib/components/DropZone.svelte';
  import type { ChangeEventHandler } from 'svelte/elements';

  let file: File | null = null;
  let src: string | null = null;
  let pallete = `
      #ffffff
      #0000ff
      #00ff00
      #ff0000
      #000000
  `
    .split('\n')
    .flatMap((line) => line.trim() || [])
    .join('\n');
  let textarea = pallete;

  function submit(ev: SubmitEvent) {
    ev.preventDefault();
    pallete = textarea;
  }

  function onFileInputChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    file = input.files?.[0] ?? null;
  }

  $: {
    if (src) {
      URL.revokeObjectURL(src);
      src = null;
    }
    if (file) {
      src = URL.createObjectURL(file);
    }
  }

  $: imagePromise = src ? createImage(src) : null;
  $: ditheredPromise = imagePromise
    ? Promise.resolve(imagePromise).then((image) =>
        applyFloydSteinberg(image, Color.createPalleteFromHexCodes(pallete))
      )
    : null;
</script>

<div class="container">
  <div>
    <form on:submit={submit} class="form">
      <textarea bind:value={textarea}></textarea>
      <button type="submit">set pallete</button>
    </form>

    <input type="file" accept="image/*" on:change={onFileInputChange} />
  </div>

  <DropZone bind:file>
    <div class="dropzone">
      {#if ditheredPromise}
        {#await ditheredPromise then image}
          <Canvas {image} />
        {/await}
      {:else}
        <h1>Drop an image here</h1>
      {/if}
    </div>
  </DropZone>
</div>

<style>
  .container {
    position: relative;
    border-radius: 0.3em;
    display: flex;
    justify-content: stretch;
    align-items: stretch;
    gap: 1em;
  }

  .dropzone {
    padding: 1em;
    border: 2px solid #333;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1em;

    textarea {
      min-height: 20em;
    }
  }
</style>
