<script lang="ts">
  import { modelStore } from '../stores/model.svelte';
  import type { ViewMode } from '../lib/types';

  const tabs: { id: ViewMode; label: string }[] = [
    { id: 'timeline', label: 'Timeline' },
    { id: 'slice', label: 'Slices & Scenarios' },
    { id: 'table', label: 'Consolidated' },
  ];

  function handleExpandAllChange(event: Event) {
    const target = event.target as HTMLInputElement;
    modelStore.setExpandAll(target.checked);
  }
</script>

<nav class="tabs">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={modelStore.view === tab.id}
      onclick={() => modelStore.setView(tab.id)}
    >
      {tab.label}
    </button>
  {/each}

  <label class="toggle-expand">
    <input
      type="checkbox"
      checked={modelStore.expandAll}
      onchange={handleExpandAllChange}
    />
    Expand All
  </label>
</nav>

<style>
  .tabs {
    display: flex;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .tab {
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
    font-family: inherit;
  }

  .tab:hover {
    background: var(--bg-card);
    color: var(--text-primary);
  }

  .tab.active {
    background: var(--color-command);
    border-color: var(--color-command);
    color: var(--bg-primary);
  }

  .toggle-expand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    padding: 0.4rem 0.75rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--text-secondary);
    transition: all 0.2s;
  }

  .toggle-expand:hover {
    color: var(--text-primary);
    border-color: var(--text-secondary);
  }

  .toggle-expand input {
    accent-color: var(--color-command);
    cursor: pointer;
  }
</style>
