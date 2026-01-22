<script lang="ts">
  import { modelStore } from '../stores/model.svelte';
</script>

<header class="header">
  <div class="header-left">
    <h1>{modelStore.model?.name ?? 'Information Flow'}</h1>
    {#if modelStore.model?.description}
      <span class="meta">{modelStore.model.description}</span>
    {/if}
  </div>
  <div class="header-right">
    {#if modelStore.model?.version}
      <span class="version">v{modelStore.model.version}</span>
    {/if}
    <span class="status">
      Watching {modelStore.watchedFile}
    </span>
  </div>
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  h1 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .meta {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .version {
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-family: var(--font-mono);
  }

  .status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-success);
  }

  .status::before {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--color-success);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
</style>
