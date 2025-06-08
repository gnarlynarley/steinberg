<script lang="ts">
  type Props = {
    labelElement: HTMLLabelElement | undefined;
    hex: string | null;
    label: string;
    name?: string;
    dir: 'ltr' | 'rtl';
  };

  let { labelElement = $bindable(), label, hex, name }: Props = $props();

  function preventDefault(e: MouseEvent) {
    e.preventDefault();
    /* prevent browser color picker from opening unless javascript is broken */
  }
</script>

<label bind:this={labelElement} style="--color:{hex}" title={label}>
  <input
    type="color"
    {name}
    value={hex}
    onclick={preventDefault}
    onmousedown={preventDefault}
    aria-haspopup="dialog"
  />
</label>

<style>
  label {
    aspect-ratio: 1 / 1;
    width: 2em;
    display: block;
    background-color: var(--color);
    border-radius: 0.2em;
    border: 1px solid black;
  }
  input {
    display: none;
  }
</style>
