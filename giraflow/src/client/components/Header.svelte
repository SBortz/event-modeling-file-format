<script lang="ts">
  import { modelStore } from '../stores/model.svelte';
</script>

<header class="header">
  <div class="header-left">
    <img src="/logo.svg" alt="Giraflow" class="logo" />
  </div>
  <div class="header-right">
    {#if modelStore.isPublicMode}
      <span class="model-name">
        {modelStore.model?.name ?? 'Giraflow Editor'}
      </span>
    {:else}
      <span class="status">
        Watching {modelStore.watchedFile}
      </span>
    {/if}
  </div>
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem 0rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    width: 150px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
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

  .model-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
</style>
