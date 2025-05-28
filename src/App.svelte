<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import createImage from './lib/utils/createImage';
  import applyFloydSteinberg from './lib/utils/applyFloydSteinberg';
  import Color from './lib/utils/Color';
  import DropZone from './lib/components/DropZone.svelte';
  import resizeImage from './lib/utils/resizeImage';

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
  let width = 500;

  let form: HTMLFormElement;

  function submit(ev: SubmitEvent) {
    ev.preventDefault();
    const formData = new FormData(form);
    pallete = formData.get('pallete')! as string;
    width = parseInt(formData.get('width') as string, 10) || 500;
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
  $: resizedImage = imagePromise
    ? imagePromise.then((image) => resizeImage(image, width))
    : null;
  $: ditheredPromise = resizedImage
    ? resizedImage.then((image) =>
        applyFloydSteinberg(image, Color.createPalleteFromHexCodes(pallete))
      )
    : null;
</script>

<div class="container">
  <div class="sidebar">
    <input type="file" accept="image/*" on:change={onFileInputChange} />

    <form bind:this={form} on:submit={submit} class="form">
      <textarea defaultValue={pallete} name="pallete"></textarea>
      <input defaultValue={width} type="number" name="width" />
      <button type="submit">Render</button>
    </form>
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

  .sidebar {
    display: flex;
    flex-direction: column;
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
    padding: 0.5em;
    border: 2px solid #333;

    textarea {
      min-height: 20em;
    }
  }
</style>
