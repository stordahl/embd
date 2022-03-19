<script>
	export let text
	export let callback
</script>

<button on:click={callback}>{text}</button>

<style>
	button {
		border: 0;
		padding: 5px 10px;
		font-size: 1.2rem;
	}
</style>
