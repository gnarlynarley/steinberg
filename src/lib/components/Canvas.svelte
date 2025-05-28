<script lang="ts">
  export let image: HTMLImageElement | HTMLCanvasElement;

  let canvas: HTMLCanvasElement | null = null;
  $: context = canvas?.getContext('2d');

  $: {
    if (canvas && context && image) {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);
    }
  }
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
