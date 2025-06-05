<script lang="ts">
  import type { Snippet } from 'svelte';

  let dialog: HTMLDialogElement;

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();

  $effect(() => {
    dialog.showModal();
  });
</script>

<dialog bind:this={dialog}>
  {@render children?.()}
</dialog>

<style>
  dialog {
    background: var(--color-background);
    border: 2px solid var(--color-accent);
    border-radius: var(--border-radius);
    color: inherit;
  }

  dialog::backdrop {
    background: color-mix(in srgb, var(--color-background), transparent 20%);
  }
</style>
