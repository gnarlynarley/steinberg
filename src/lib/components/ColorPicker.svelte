<script lang="ts">
  import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
  import ColorPickerInput from './ColorPickerInput.svelte';
  export let name: string;
  export let value: string;
</script>

<div>
  <ColorPicker
    {name}
    bind:hex={value}
    position="responsive"
    sliderDirection="horizontal"
    isDark
    isAlpha={false}
    label=""
    components={{ ...ChromeVariant, input: ColorPickerInput }}
  />
</div>

<style>
  div {
    color: black;
  }
</style>
