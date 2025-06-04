<script lang="ts">
  import Button from './Button.svelte';
  import ColorPicker from './ColorPicker.svelte';

  let deleteMode = false;

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
  <div class="wrapper" class:is-delete-mode={deleteMode}>
    {#each value as hex, i}
      <div class="item">
        {#if deleteMode}
          <button
            type="button"
            class="delete-button"
            aria-label="delete color"
            on:click={() => removeColor(i)}
          ></button>
        {/if}
        <ColorPicker name="color" bind:value={hex} />
      </div>
    {/each}
  </div>
  <Button type="button" onclick={addColor}>add</Button>
  <Button
    type="button"
    onclick={() => (deleteMode = !deleteMode)}
    primary={deleteMode}
  >
    {deleteMode ? 'stop removing colors' : 'remove colors'}
  </Button>
</div>

<style>
  .wrapper {
    gap: var(--gutter);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2em, 1fr));
    justify-content: center;
    padding: var(--gutter) 0;
    margin-bottom: var(--gutter);

    &.is-delete-mode {
      background: var(--color-error);
    }
  }

  .item {
    position: relative;
    .delete-button {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
    }
  }
</style>
