<script lang="ts">
  interface Props {
    src: string;
    title?: string;
  }
  let { src, title = 'Wireframe' }: Props = $props();
</script>

<div class="wireframe-container">
  <iframe
    {title}
    src={src}
    sandbox="allow-scripts"
    class="wireframe-iframe"
  ></iframe>
</div>

<style>
  .wireframe-container {
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    overflow: hidden;
    background: white;
  }
  .wireframe-iframe {
    width: 100%;
    height: 300px;
    border: none;
  }
</style>
