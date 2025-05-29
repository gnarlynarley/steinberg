<script lang="ts">
  import ColorPicker from './ColorPicker.svelte';

  function removeColor(index: number) {
    console.log(index);
    value.splice(index, 1);
    value = value;
  }

  function addColor() {
    value.push('#000000');
    value = value;
  }

  export let value: string[];
</script>

<div>
  <div class="wrapper">
    {#each value as hex, i}
      <div>
        <ColorPicker name="color" bind:value={hex} />
        <button type="button" on:click={() => removeColor(i)}>remove</button>
      </div>
    {/each}
  </div>
  <button type="button" on:click={addColor}>add</button>
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--gutter);
  }
</style>
