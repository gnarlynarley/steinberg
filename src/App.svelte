<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import createImage from './lib/utils/createImage';
  import applyFloydSteinberg from './lib/utils/applyFloydSteinberg';
  import Color from './lib/utils/Color';
  import DropZone from './lib/components/DropZone.svelte';
  import resizeImage from './lib/utils/resizeImage';
  import PalletePicker from './lib/components/PalletePicker.svelte';

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
    .flatMap((line) => line.trim() || []);
  let showOriginal = false;
  let renderPallete = pallete;
  let width = 500;

  let form: HTMLFormElement;

  function submit(ev: SubmitEvent) {
    ev.preventDefault();
    const formData = new FormData(form);
    width = parseInt(formData.get('width') as string, 10) || 500;
    renderPallete = pallete;
    showOriginal = false;
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
        applyFloydSteinberg(
          image,
          Color.createPalleteFromHexCodes(renderPallete.join('\n'))
        )
      )
    : null;
  $: shownImage = showOriginal ? imagePromise : ditheredPromise;
</script>

<div class="container">
  <div class="sidebar">
    <div>
      <label>
        Show original <input type="checkbox" bind:checked={showOriginal} />
      </label>
    </div>
    <input type="file" accept="image/*" on:change={onFileInputChange} />

    <form bind:this={form} on:submit={submit} class="form">
      <input defaultValue={width} type="number" name="width" />
      <PalletePicker value={pallete} />
      <button type="submit">Render</button>
    </form>
  </div>

  <DropZone bind:file>
    <div class="dropzone">
      {#if shownImage}
        {#await shownImage then image}
          <Canvas {image} pixelated />
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
    gap: 1em;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 1em;
    position: sticky;
    top: 0;
    padding: 1em;
  }

  .dropzone {
    padding: 1em;
    border: 2px solid #333;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em;
    border: 2px solid #333;
  }
</style>
