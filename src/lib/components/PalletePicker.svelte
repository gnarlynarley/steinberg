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
  {#each value as hex, i}
    <div>
      <ColorPicker name="color" bind:value={hex} />
      <button type="button" on:click={() => removeColor(i)}>remove</button>
    </div>
  {/each}
  <button type="button" on:click={addColor}>add</button>
</div>
