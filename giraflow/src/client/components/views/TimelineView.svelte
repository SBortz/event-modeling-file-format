<script lang="ts">
  import { modelStore } from '../../stores/model.svelte';
  import type { TimelineElement, Event, StateView, Command, Actor } from '../../lib/types';
  import { isEvent, isState, isCommand, isActor } from '../../lib/types';
  import JsonDisplay from '../shared/JsonDisplay.svelte';
  import WireframeViewer from '../shared/WireframeViewer.svelte';

  const symbols: Record<string, string> = {
    event: '●',
    state: '◆',
    command: '▶',
    actor: '○',
  };

  function getPosition(type: string): 'left' | 'center' | 'right' {
    if (type === 'event') return 'left';
    if (type === 'actor') return 'right';
    return 'center';
  }

  function scrollToDetail(tick: number) {
    const element = document.getElementById(`tick-${tick}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('highlight-flash');
      setTimeout(() => element.classList.remove('highlight-flash'), 2000);
    }
  }

  let sortedTimeline = $derived(
    modelStore.model
      ? [...modelStore.model.timeline].sort((a, b) => a.tick - b.tick)
      : []
  );
</script>

<div class="timeline-master-detail">
  <!-- Master: Compact timeline on the left -->
  <aside class="timeline-master">
    <div class="tl-master-line"></div>
    {#each sortedTimeline as el}
      {@const position = getPosition(el.type)}
      <button class="tl-master-item tl-{position}" onclick={() => scrollToDetail(el.tick)}>
        <span class="tl-tick">@{el.tick}</span>
        <span class="tl-symbol {el.type}">{symbols[el.type]}</span>
        <span class="tl-name {el.type}">{el.name}</span>
      </button>
    {/each}
  </aside>

  <!-- Detail: Continuous stream on the right -->
  <main class="timeline-detail">
    {#each sortedTimeline as el}
      {@const position = getPosition(el.type)}
      <section class="tl-detail-item tl-{position}" id="tick-{el.tick}">
        <div class="tl-detail-header">
          <span class="tl-symbol {el.type}">{symbols[el.type]}</span>
          <span class="tl-tick">@{el.tick}</span>
          <span class="tl-name {el.type}">{el.name}</span>
        </div>
        <div class="tl-detail-content">
          {#if isEvent(el)}
            {#if el.producedBy}
              <div class="tl-detail-row">producedBy: <span class="command">{el.producedBy}</span></div>
            {/if}
            {#if el.externalSource}
              <div class="tl-detail-row">externalSource: {el.externalSource}</div>
            {/if}
            {#if el.example}
              <JsonDisplay data={el.example} class="tl-json" />
            {/if}
          {:else if isState(el)}
            {#if el.sourcedFrom.length > 0}
              <div class="tl-detail-row">
                sourcedFrom: {#each el.sourcedFrom as eventName, i}<span class="event">{eventName}</span>{i < el.sourcedFrom.length - 1 ? ', ' : ''}{/each}
              </div>
            {/if}
            {#if el.example}
              <JsonDisplay data={el.example} class="tl-json" />
            {/if}
          {:else if isActor(el)}
            <div class="tl-detail-row">
              reads <span class="state">{el.readsView}</span> → triggers <span class="command">{el.sendsCommand}</span>
            </div>
            {#if el.wireframes && el.wireframes.length > 0}
              <div class="tl-wireframes">
                {#each el.wireframes as wireframe}
                  <WireframeViewer src="/wireframes/{wireframe}" title="{el.name} - {wireframe}" />
                {/each}
              </div>
            {/if}
          {:else if isCommand(el)}
            {#if el.example}
              <JsonDisplay data={el.example} class="tl-json" />
            {/if}
          {/if}
        </div>
      </section>
    {/each}
  </main>
</div>

<style>
  .timeline-master-detail {
    display: flex;
    font-family: var(--font-mono);
    min-height: calc(100vh - 120px);
  }

  /* Master sidebar */
  .timeline-master {
    width: 30%;
    min-width: 240px;
    max-width: 360px;
    position: sticky;
    top: 120px;
    align-self: flex-start;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    background: var(--bg-card);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    border-radius: 0 0 0.5rem 0.5rem;
    box-shadow: var(--shadow-card);
  }

  .tl-master-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 90px;
    pointer-events: none;
    z-index: 2;
    background-image:
      /* Hatching for middle lane only */
      repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(107,114,128,0.18) 3px, rgba(107,114,128,0.18) 4px),
      /* Tint for all 3 lanes */
      linear-gradient(rgba(107,114,128,0.05), rgba(107,114,128,0.05)),
      linear-gradient(rgba(107,114,128,0.05), rgba(107,114,128,0.05)),
      linear-gradient(rgba(107,114,128,0.05), rgba(107,114,128,0.05)),
      /* 4 vertical lines */
      linear-gradient(rgba(107,114,128,0.4), rgba(107,114,128,0.4)),
      linear-gradient(rgba(107,114,128,0.4), rgba(107,114,128,0.4)),
      linear-gradient(rgba(107,114,128,0.4), rgba(107,114,128,0.4)),
      linear-gradient(rgba(107,114,128,0.4), rgba(107,114,128,0.4));
    background-position:
      46px 0,
      22px 0, 46px 0, 70px 0,
      20px 0, 44px 0, 68px 0, 88px 0;
    background-size:
      22px 100%,
      22px 100%, 22px 100%, 22px 100%,
      2px 100%, 2px 100%, 2px 100%, 2px 100%;
    background-repeat: no-repeat;
  }

  .tl-master-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 0;
    gap: 0.5rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: background 0.15s;
  }

  .tl-master-item:last-child {
    border-bottom: none;
  }

  .tl-master-item:hover {
    background: var(--bg-secondary);
  }

  .tl-master-item .tl-tick {
    color: var(--text-secondary);
    font-size: 0.75rem;
    flex-shrink: 0;
    width: 2.5rem;
  }

  .tl-master-item .tl-symbol {
    width: 90px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.9rem;
    font-weight: bold;
    flex-shrink: 0;
    position: relative;
    z-index: 3;
  }

  .tl-master-item.tl-left .tl-symbol {
    padding-left: 27px;
  }

  .tl-master-item.tl-center .tl-symbol {
    padding-left: 51px;
  }

  .tl-master-item.tl-right .tl-symbol {
    padding-left: 75px;
  }

  .tl-master-item .tl-name {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Detail area */
  .timeline-detail {
    flex: 1;
    padding: 1.5rem 2rem;
    overflow-y: auto;
  }

  .tl-detail-item {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow-card);
    overflow: hidden;
  }

  .tl-detail-item:last-child {
    margin-bottom: 0;
  }

  .tl-detail-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
  }

  .tl-detail-header .tl-symbol {
    font-size: 1.1rem;
    font-weight: bold;
    flex-shrink: 0;
  }

  .tl-detail-header .tl-tick {
    color: var(--text-secondary);
    font-size: 0.85rem;
    flex-shrink: 0;
  }

  .tl-detail-header .tl-name {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .tl-detail-content {
    padding: 1rem;
  }

  .tl-detail-content:empty {
    display: none;
  }

  .tl-detail-row {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }

  .tl-detail-row:last-child {
    margin-bottom: 0;
  }

  /* Color classes */
  .tl-symbol.event { color: var(--color-event); }
  .tl-symbol.state { color: var(--color-state); }
  .tl-symbol.command { color: var(--color-command); }
  .tl-symbol.actor { color: var(--color-actor); }

  .tl-name.event { color: var(--color-event); }
  .tl-name.state { color: var(--color-state); }
  .tl-name.actor { color: var(--color-actor); }
  .tl-name.command { color: var(--color-command); }

  .tl-detail-row .event { color: var(--color-event); }
  .tl-detail-row .state { color: var(--color-state); }
  .tl-detail-row .actor { color: var(--color-actor); }
  .tl-detail-row .command { color: var(--color-command); }

  :global(.tl-json) {
    margin-top: 0.5rem;
    font-size: 0.75rem !important;
  }

  .tl-wireframes {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  :global(.highlight-flash) {
    animation: flash 2s ease-out;
  }

  @keyframes flash {
    0%, 20% { background: rgba(234, 179, 8, 0.25); }
    100% { background: transparent; }
  }
</style>
