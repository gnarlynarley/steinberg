<script lang="ts">
  export let name: string;
  export let value: string;
</script>

<input bind:value {name} type="color" />
