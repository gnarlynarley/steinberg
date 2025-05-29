<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import createImage from './lib/utils/createImage';
  import applyFloydSteinberg from './lib/utils/applyFloydSteinberg';
  import Color from './lib/utils/Color';
  import DropZone from './lib/components/DropZone.svelte';
  import resizeImage from './lib/utils/resizeImage';
  import PalletePicker from './lib/components/PalletePicker.svelte';
  import downloadImage from './lib/utils/downloadImage';
  import getImagePallete from './lib/utils/getImagePallete';

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
  let colorCount = 5;
  let edgeDetection = true;
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
          Color.createPalleteFromHexCodes(renderPallete.join('\n')),
          edgeDetection
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

      <label>
        With edge detection <input
          type="checkbox"
          bind:checked={edgeDetection}
        />
      </label>
    </div>
    <input type="file" accept="image/*" on:change={onFileInputChange} />

    <form bind:this={form} on:submit={submit} class="form">
      <label for="width">Width</label>
      <input id="width" defaultValue={width} type="number" name="width" />

      <PalletePicker value={pallete} />
      {#if imagePromise}
        {#await imagePromise then image}
          <label>
            <span>Color count:</span>
            <input type="number" bind:value={colorCount} />
          </label>
          <button
            type="button"
            on:click={() => {
              pallete = getImagePallete(image, colorCount);
            }}
          >
            get color pallete from image
          </button>
        {/await}
      {/if}
      <button type="submit">Render</button>
    </form>

    {#if ditheredPromise}
      {#await ditheredPromise then image}
        <h3>Download</h3>
        <div>
          <button type="button" on:click={() => downloadImage(image, 1)}>
            1x
          </button>
          <button type="button" on:click={() => downloadImage(image, 2)}>
            2x
          </button>
          <button type="button" on:click={() => downloadImage(image, 3)}>
            3x
          </button>
          <button type="button" on:click={() => downloadImage(image, 4)}>
            4x
          </button>
        </div>
      {/await}
    {/if}
  </div>

  <DropZone bind:file>
    {#if shownImage}
      {#await shownImage then image}
        <Canvas {image} pixelated />
      {/await}
    {:else}
      <h1>Drop an image here</h1>
    {/if}
  </DropZone>
</div>

<style>
  label {
    display: block;
  }

  .container {
    position: relative;
    border-radius: 0.3em;
    gap: 1em;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: flex-start;
    min-height: 100vh;
  }

  .sidebar {
    padding: var(--gutter);
    display: flex;
    flex-direction: column;
    gap: 1em;
    position: sticky;
    top: 0;
    padding: 1em;
    max-height: 100vh;
    overflow: auto;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em;
    border: 2px solid #333;
  }
</style>
