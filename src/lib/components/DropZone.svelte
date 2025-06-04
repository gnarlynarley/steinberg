<script lang="ts">
  export let file: File | null = null;

  function dragstart(ev: DragEvent) {
    ev.preventDefault();
  }

  function dragover(ev: DragEvent) {
    ev.preventDefault();
  }

  function drop(ev: DragEvent) {
    ev.preventDefault();
    file = ev.dataTransfer?.files[0] ?? null;
  }
</script>

<div
  role="region"
  on:dragstart={dragstart}
  on:dragover={dragover}
  on:drop={drop}
>
  <slot />
</div>

<style>
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--border-radius);
    border: var(--border);
  }
</style>