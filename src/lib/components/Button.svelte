<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  type Props = SvelteHTMLElements['button'] & {
    primary?: boolean;
  };

  const { children, primary, type = 'button', ...rest }: Props = $props();
</script>

<button {type} {...rest} class:is-primary={primary}>
  {@render children?.()}
</button>

<style>
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
    color: inherit;
    font: inherit;

    &.is-primary {
      background-color: var(--color-primary);
    }
  }
  button:hover {
    border-color: var(--color-primary);
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  button:disabled {
    opacity: 0.5;
  }
</style>
