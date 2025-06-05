<script lang="ts">
  import Button from './Button.svelte';
  import Dialog from './Dialog.svelte';

  type Props = {
    label: string;
    defaultValue: number;
    onsubmit: (value: number) => void;
    onclose: () => void;
  };
  const { label, onsubmit, onclose, defaultValue }: Props = $props();

  let value: number = $state(defaultValue);
</script>

<Dialog>
  <form
    method="dialog"
    onsubmit={() => {
      onsubmit(value);
    }}
    {onclose}
  >
    <label>
      <span>{label}</span>
      <input type="number" bind:value />
    </label>

    <div class="footer">
      <Button type="button" onclick={onclose}>Cancel</Button>
      <Button type="submit" value="submit">Submit</Button>
    </div>
  </form>
</Dialog>

<style>
  .footer {
    display: flex;
    justify-content: space-between;
    padding-top: var(--gutter);
  }
</style>
