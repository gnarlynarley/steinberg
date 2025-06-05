<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import createImage from './lib/utils/createImage';
  import applyFloydSteinberg, {
    type AlgorithmName,
    MATRIX_ALGORITH_NAMES,
  } from './lib/utils/applyFloydSteinberg';
  import Color from './lib/utils/Color';
  import DropZone from './lib/components/DropZone.svelte';
  import resizeImage from './lib/utils/resizeImage';
  import PalletePicker from './lib/components/PalletePicker.svelte';
  import downloadImage from './lib/utils/downloadImage';
  import getImagePallete from './lib/utils/getImagePallete';
  import { file } from './lib/store/file';
  import Button from './lib/components/Button.svelte';
  import getDialogValue from './lib/utils/getDialogValue';

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
  let edgeDetectionLevel = 0;
  let sharpeningLevel = 0;
  let width = 500;

  $: hasEnoughColors = pallete.length >= 2;
  $: canRender = hasEnoughColors;

  let algorithm: AlgorithmName = 'Floyd Steinberg';

  function onAlgorithmChange(
    event: Event & { currentTarget: HTMLInputElement }
  ) {
    algorithm = event.currentTarget.value as AlgorithmName;
  }

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
    $file = input.files?.[0] ?? null;
  }

  $: {
    if (src) {
      URL.revokeObjectURL(src);
      src = null;
    }
    if ($file) {
      src = URL.createObjectURL($file);
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
          edgeDetectionLevel || null,
          sharpeningLevel || null,
          algorithm
        )
      )
    : null;
  $: shownImage = showOriginal ? imagePromise : ditheredPromise;
</script>

<div class="container">
  <div class="sidebar">
    <input type="file" accept="image/*" on:change={onFileInputChange} />

    <label>
      Show original <input type="checkbox" bind:checked={showOriginal} />
    </label>

    <label>
      <span>Edge detection</span>
      <input
        type="range"
        min="0"
        max="10"
        bind:value={edgeDetectionLevel}
        step="0.1"
      />
    </label>

    <label>
      <span>Sharpening</span>
      <input
        type="range"
        min="0"
        max="10"
        bind:value={sharpeningLevel}
        step="0.1"
      />
    </label>

    <div>
      <h3>Dithering algorithm</h3>
      {#each MATRIX_ALGORITH_NAMES as name}
        <label>
          <input
            checked={algorithm === name}
            type="radio"
            value={name}
            name="algorithm"
            on:change={onAlgorithmChange}
          />
          <span>{name}</span>
        </label>
      {/each}
    </div>

    {#if imagePromise}
      <form bind:this={form} on:submit={submit} class="form">
        <label for="width">Width</label>
        <input id="width" defaultValue={width} type="number" name="width" />

        <PalletePicker bind:value={pallete} />
        {#await imagePromise then image}
          <Button
            type="button"
            onclick={async () => {
              const colorCount = await getDialogValue('How many colors?', 16);
              if (colorCount === null) return;
              pallete = getImagePallete(image, colorCount);
            }}
          >
            get color pallete from image
          </Button>
        {/await}
        <Button type="submit" primary disabled={!canRender}>Render</Button>
        {#if !hasEnoughColors}
          <p>Needs at least two colors</p>
        {/if}
      </form>
    {/if}

    {#if ditheredPromise}
      {#await ditheredPromise then image}
        <h3>Download</h3>
        <div>
          <Button type="button" onclick={() => downloadImage(image, 1)}>
            1x
          </Button>
          <Button type="button" onclick={() => downloadImage(image, 2)}>
            2x
          </Button>
          <Button type="button" onclick={() => downloadImage(image, 3)}>
            3x
          </Button>
          <Button type="button" onclick={() => downloadImage(image, 4)}>
            4x
          </Button>
        </div>
      {/await}
    {/if}
  </div>

  <div class="main">
    <DropZone bind:file={$file}>
      {#if shownImage}
        {#await shownImage then image}
          <div class="canvas">
            <Canvas {image} pixelated />
          </div>
        {/await}
      {:else}
        <div class="placeholder">
          <h1>Drop an image here</h1>
        </div>
      {/if}
    </DropZone>
  </div>
</div>

<style>
  label {
    display: block;
  }

  .container {
    position: relative;
    gap: 1em;
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    min-width: 800px;
  }

  .main {
    position: sticky;
    top: 0;
    left: 0;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .canvas {
    position: relative;
    height: 100vh;
    width: 100%;
  }

  .sidebar {
    padding: var(--gutter);
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 0.5em;
    border: 2px solid #333;
  }
</style>
