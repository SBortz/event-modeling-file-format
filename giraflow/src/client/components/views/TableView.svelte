<script lang="ts">
  import { modelStore } from "../../stores/model.svelte";

  interface DeduplicatedItem {
    name: string;
    ticks: number[];
    count: number;
  }

  interface DeduplicatedStateView extends DeduplicatedItem {
    sourcedFrom: string[];
  }

  // Deduplicate with occurrence counts
  function deduplicateWithCounts<T extends { name: string; tick: number }>(
    items: T[],
  ): DeduplicatedItem[] {
    const map = new Map<string, number[]>();
    for (const item of items) {
      const ticks = map.get(item.name) || [];
      ticks.push(item.tick);
      map.set(item.name, ticks);
    }
    return [...map.entries()]
      .map(([name, ticks]) => ({
        name,
        ticks: ticks.sort((a, b) => a - b),
        count: ticks.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Deduplicate states with sourcedFrom info
  function deduplicateStates(
    items: { name: string; tick: number; sourcedFrom: string[] }[],
  ): DeduplicatedStateView[] {
    const map = new Map<string, { ticks: number[]; sourcedFrom: string[] }>();
    for (const item of items) {
      const existing = map.get(item.name);
      if (existing) {
        existing.ticks.push(item.tick);
      } else {
        map.set(item.name, {
          ticks: [item.tick],
          sourcedFrom: item.sourcedFrom,
        });
      }
    }
    return [...map.entries()]
      .map(([name, { ticks, sourcedFrom }]) => ({
        name,
        ticks: ticks.sort((a, b) => a - b),
        count: ticks.length,
        sourcedFrom,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  let deduplicatedEvents = $derived(deduplicateWithCounts(modelStore.events));
  let deduplicatedStates = $derived(deduplicateStates(modelStore.states));
  let deduplicatedCommands = $derived(
    deduplicateWithCounts(modelStore.commands),
  );
  let deduplicatedActors = $derived(deduplicateWithCounts(modelStore.actors));
</script>

<div class="table-view">
  {#if modelStore.model}
    <div class="model-info">
      <div class="model-info-header">
        <h2>{modelStore.model.name}</h2>
        {#if modelStore.model.version}
          <span class="model-version">v{modelStore.model.version}</span>
        {/if}
      </div>
      {#if modelStore.model.description}
        <p class="model-description">{modelStore.model.description}</p>
      {/if}
    </div>
  {/if}

  {#if deduplicatedEvents.length > 0}
    <div class="table-section">
      <h2 class="events">
        <span class="symbol">●</span> Events ({modelStore.events.length} total, {deduplicatedEvents.length}
        unique)
      </h2>
      <table>
        <thead>
          <tr>
            <th class="col-name">Name</th>
            <th class="col-occurrences">Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {#each deduplicatedEvents as event}
            <tr>
              <td class="col-name"><span class="event">{event.name}</span></td>
              <td class="col-occurrences">
                <div class="tick-chips">
                  {#each event.ticks as tick}
                    <button
                      class="tick-chip"
                      onclick={() => modelStore.navigateToTick(tick)}
                      >@{tick}</button
                    >
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if deduplicatedStates.length > 0}
    <div class="table-section">
      <h2 class="states">
        <span class="symbol">◆</span> State Views ({modelStore.states.length} total,
        {deduplicatedStates.length} unique)
      </h2>
      <table>
        <thead>
          <tr>
            <th class="col-name">Name</th>
            <th class="col-occurrences">Occurrences</th>
            <th>Sourced From</th>
          </tr>
        </thead>
        <tbody>
          {#each deduplicatedStates as state}
            <tr>
              <td class="col-name"><span class="state">{state.name}</span></td>
              <td class="col-occurrences">
                <div class="tick-chips">
                  {#each state.ticks as tick}
                    <button
                      class="tick-chip"
                      onclick={() => modelStore.navigateToTick(tick)}
                      >@{tick}</button
                    >
                  {/each}
                </div>
              </td>
              <td>
                {#each state.sourcedFrom as eventName, i}
                  <span class="event">{eventName}</span>{i <
                  state.sourcedFrom.length - 1
                    ? ", "
                    : ""}
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if deduplicatedCommands.length > 0}
    <div class="table-section">
      <h2 class="commands">
        <span class="symbol">▶</span> Commands ({modelStore.commands.length} total,
        {deduplicatedCommands.length} unique)
      </h2>
      <table>
        <thead>
          <tr>
            <th class="col-name">Name</th>
            <th class="col-occurrences">Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {#each deduplicatedCommands as command}
            <tr>
              <td class="col-name"
                ><span class="command">{command.name}</span></td
              >
              <td class="col-occurrences">
                <div class="tick-chips">
                  {#each command.ticks as tick}
                    <button
                      class="tick-chip"
                      onclick={() => modelStore.navigateToTick(tick)}
                      >@{tick}</button
                    >
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if deduplicatedActors.length > 0}
    <div class="table-section">
      <h2 class="actors">
        <span class="symbol">○</span> Actors ({modelStore.actors.length} total, {deduplicatedActors.length}
        unique)
      </h2>
      <table>
        <thead>
          <tr>
            <th class="col-name">Name</th>
            <th class="col-occurrences">Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {#each deduplicatedActors as actor}
            <tr>
              <td class="col-name"><span class="actor">{actor.name}</span></td>
              <td class="col-occurrences">
                <div class="tick-chips">
                  {#each actor.ticks as tick}
                    <button
                      class="tick-chip"
                      onclick={() => modelStore.navigateToTick(tick)}
                      >@{tick}</button
                    >
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .table-view {
    padding: 2rem;
  }

  .model-info {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    padding: 1.25rem 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-card);
  }

  .model-info-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .model-info-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .model-version {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-secondary);
  }

  .model-description {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  .table-section {
    margin-bottom: 2rem;
  }

  .table-section h2 {
    font-size: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .table-section h2 .symbol {
    font-size: 1.25rem;
  }

  .table-section h2.events .symbol {
    color: var(--color-event);
  }
  .table-section h2.states .symbol {
    color: var(--color-state);
  }
  .table-section h2.commands .symbol {
    color: var(--color-command);
  }
  .table-section h2.actors .symbol {
    color: var(--color-actor);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: var(--bg-card);
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--shadow-card);
    table-layout: fixed;
  }

  th,
  td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  th {
    background: var(--bg-secondary);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: var(--bg-secondary);
  }

  .col-name {
    width: 350px;
  }

  .event {
    color: var(--color-event);
  }
  .state {
    color: var(--color-state);
  }
  .command {
    color: var(--color-command);
  }
  .actor {
    color: var(--color-actor);
  }

  .tick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    align-items: center;
  }

  .tick-chip {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    line-height: 1;
    border: 1px solid var(--border);
    cursor: pointer;
    font-family: var(--font-mono);
    transition: all 0.15s;
  }

  .tick-chip:hover {
    background: var(--color-command);
    color: white;
    border-color: var(--color-command);
  }
</style>
