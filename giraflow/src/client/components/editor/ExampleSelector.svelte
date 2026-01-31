<script lang="ts">
  import { examples, type Example } from '../../lib/examples';

  interface Props {
    selectedId: string;
    onSelect: (example: Example) => void;
  }

  let { selectedId, onSelect }: Props = $props();
</script>

<div class="example-selector">
  <label for="example-select">Example:</label>
  <select
    id="example-select"
    value={selectedId}
    onchange={(e) => {
      const example = examples.find(ex => ex.id === e.currentTarget.value);
      if (example) onSelect(example);
    }}
  >
    {#each examples as example}
      <option value={example.id}>{example.name}</option>
    {/each}
  </select>
  <span class="description">
    {examples.find(e => e.id === selectedId)?.description ?? ''}
  </span>
</div>

<style>
  .example-selector {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  select {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    background: var(--bg-card);
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: inherit;
    cursor: pointer;
    min-width: 200px;
  }

  select:hover {
    border-color: var(--text-tertiary);
  }

  select:focus {
    outline: none;
    border-color: var(--color-command);
  }

  .description {
    font-size: 0.8rem;
    color: var(--text-tertiary);
  }
</style>
