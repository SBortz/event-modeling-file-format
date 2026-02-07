/**
 * SVG Export for Giraflow Models
 * 
 * Generates a deterministic Event Model diagram as SVG.
 * Respects swimlane structure:
 * - Left: Event lanes (grouped by system)
 * - Center: Commands & State Views
 * - Right: Actor lanes (grouped by role)
 */

import type { GiraflowModel, Actor, Command, Event, StateView, TimelineElement } from './types';
import { isEvent, isActor, isCommand, isState } from './types';

// Giraflow colors
const COLORS = {
  event: '#ff9e64',
  eventStroke: '#df7e44',
  state: '#9ece6a',
  stateStroke: '#7eb356',
  command: '#7aa2f7',
  commandStroke: '#5a82d7',
  actor: '#6b7280',
  actorStroke: '#4b5563',
  actorAdmin: '#9333ea',
  actorAdminStroke: '#7c3aed',
  actorSystem: '#0891b2',
  actorSystemStroke: '#0e7490',
  text: '#1a1a1a',
  textLight: '#ffffff',
  line: '#e0e0e0',
  laneBg: '#f8f9fa',
  laneLabel: '#6b7280',
};

// Layout constants
const LAYOUT = {
  boxWidth: 100,
  boxHeight: 36,
  boxRadius: 6,
  tickGap: 50,
  laneWidth: 110,
  laneGap: 8,
  padding: 30,
  headerHeight: 50,
  fontSize: 10,
  fontFamily: 'Inter, system-ui, sans-serif',
};

interface LaneConfig {
  eventSystems: string[];
  actorRoles: string[];
}

interface TickColumn {
  tick: number;
  elements: TimelineElement[];
}

/**
 * Build lane configuration from model
 */
function buildLaneConfig(model: GiraflowModel): LaneConfig {
  const systemsSet = new Set<string>();
  const rolesSet = new Set<string>();
  let hasDefaultSystem = false;
  let hasDefaultRole = false;

  for (const el of model.timeline) {
    if (isEvent(el)) {
      if (el.system) systemsSet.add(el.system);
      else hasDefaultSystem = true;
    }
    if (isActor(el)) {
      if (el.role) rolesSet.add(el.role);
      else hasDefaultRole = true;
    }
  }

  // Systems: sorted reversed, default innermost
  const namedSystems = Array.from(systemsSet).sort().reverse();
  const eventSystems = hasDefaultSystem || namedSystems.length === 0
    ? [...namedSystems, '']
    : namedSystems;

  // Roles: sorted, default innermost
  const namedRoles = Array.from(rolesSet).sort();
  const actorRoles = hasDefaultRole || namedRoles.length === 0
    ? ['', ...namedRoles]
    : namedRoles;

  return { eventSystems, actorRoles };
}

/**
 * Group elements by tick
 */
function groupByTick(model: GiraflowModel): TickColumn[] {
  const tickMap = new Map<number, TimelineElement[]>();
  
  for (const el of model.timeline) {
    const existing = tickMap.get(el.tick) || [];
    existing.push(el);
    tickMap.set(el.tick, existing);
  }

  return Array.from(tickMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([tick, elements]) => ({ tick, elements }));
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Truncate text to fit in box
 */
function truncateText(text: string, maxLength: number = 14): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Get actor color based on role
 */
function getActorColors(role?: string): { fill: string; stroke: string } {
  if (role === 'Admin') return { fill: COLORS.actorAdmin, stroke: COLORS.actorAdminStroke };
  if (role === 'System') return { fill: COLORS.actorSystem, stroke: COLORS.actorSystemStroke };
  return { fill: COLORS.actor, stroke: COLORS.actorStroke };
}

/**
 * Generate the complete SVG
 */
export function generateSvg(model: GiraflowModel): string {
  const laneConfig = buildLaneConfig(model);
  const tickColumns = groupByTick(model);

  if (tickColumns.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
      <text x="200" y="100" text-anchor="middle" font-family="${LAYOUT.fontFamily}" fill="${COLORS.text}">No elements in timeline</text>
    </svg>`;
  }

  // Calculate dimensions
  const numEventLanes = laneConfig.eventSystems.length;
  const numActorLanes = laneConfig.actorRoles.length;
  const centerLaneWidth = LAYOUT.laneWidth * 1.2; // Slightly wider for commands/states
  
  const totalLaneWidth = 
    numEventLanes * LAYOUT.laneWidth + 
    centerLaneWidth + 
    numActorLanes * LAYOUT.laneWidth +
    (numEventLanes + numActorLanes + 1) * LAYOUT.laneGap;

  const contentHeight = tickColumns.length * LAYOUT.tickGap + LAYOUT.boxHeight;
  const width = totalLaneWidth + LAYOUT.padding * 2;
  const height = contentHeight + LAYOUT.headerHeight + LAYOUT.padding * 2;

  // Lane X positions
  const lanePositions: { [key: string]: number } = {};
  let currentX = LAYOUT.padding;

  // Event lanes (left side, systems reversed so outermost is leftmost)
  for (const system of laneConfig.eventSystems) {
    const key = `event:${system}`;
    lanePositions[key] = currentX + LAYOUT.laneWidth / 2;
    currentX += LAYOUT.laneWidth + LAYOUT.laneGap;
  }

  // Center lane for commands/states
  const centerX = currentX + centerLaneWidth / 2;
  lanePositions['center'] = centerX;
  currentX += centerLaneWidth + LAYOUT.laneGap;

  // Actor lanes (right side)
  for (const role of laneConfig.actorRoles) {
    const key = `actor:${role}`;
    lanePositions[key] = currentX + LAYOUT.laneWidth / 2;
    currentX += LAYOUT.laneWidth + LAYOUT.laneGap;
  }

  // Start building SVG
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <marker id="arrowhead" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
      <polygon points="0 0, 6 2.5, 0 5" fill="${COLORS.laneLabel}"/>
    </marker>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="white"/>
  
  <!-- Title -->
  <text x="${width / 2}" y="${LAYOUT.padding}" fill="${COLORS.text}" font-size="14" font-family="${LAYOUT.fontFamily}" text-anchor="middle" font-weight="600">${escapeXml(model.name)}</text>
`;

  // Lane backgrounds and headers
  const headerY = LAYOUT.padding + 15;
  const laneStartY = LAYOUT.headerHeight + LAYOUT.padding;
  const laneEndY = height - LAYOUT.padding;

  // Event system lanes
  let laneX = LAYOUT.padding;
  for (const system of laneConfig.eventSystems) {
    const label = system || 'Events';
    svg += `
  <!-- Event lane: ${label} -->
  <rect x="${laneX}" y="${laneStartY}" width="${LAYOUT.laneWidth}" height="${laneEndY - laneStartY}" fill="${COLORS.laneBg}" rx="4"/>
  <text x="${laneX + LAYOUT.laneWidth / 2}" y="${headerY}" fill="${COLORS.event}" font-size="9" font-family="${LAYOUT.fontFamily}" text-anchor="middle" font-weight="500">${escapeXml(label)}</text>
`;
    laneX += LAYOUT.laneWidth + LAYOUT.laneGap;
  }

  // Center lane
  svg += `
  <!-- Center lane: Commands & States -->
  <rect x="${laneX}" y="${laneStartY}" width="${centerLaneWidth}" height="${laneEndY - laneStartY}" fill="white" rx="4" stroke="${COLORS.line}" stroke-width="1"/>
  <text x="${laneX + centerLaneWidth / 2}" y="${headerY}" fill="${COLORS.laneLabel}" font-size="9" font-family="${LAYOUT.fontFamily}" text-anchor="middle" font-weight="500">Commands / States</text>
`;
  laneX += centerLaneWidth + LAYOUT.laneGap;

  // Actor role lanes
  for (const role of laneConfig.actorRoles) {
    const label = role || 'Actors';
    const colors = getActorColors(role);
    svg += `
  <!-- Actor lane: ${label} -->
  <rect x="${laneX}" y="${laneStartY}" width="${LAYOUT.laneWidth}" height="${laneEndY - laneStartY}" fill="${COLORS.laneBg}" rx="4"/>
  <text x="${laneX + LAYOUT.laneWidth / 2}" y="${headerY}" fill="${colors.fill}" font-size="9" font-family="${LAYOUT.fontFamily}" text-anchor="middle" font-weight="500">${escapeXml(label)}</text>
`;
    laneX += LAYOUT.laneWidth + LAYOUT.laneGap;
  }

  // Render elements by tick
  tickColumns.forEach((column, tickIndex) => {
    const y = laneStartY + 20 + tickIndex * LAYOUT.tickGap;

    for (const el of column.elements) {
      let x: number;
      let fill: string;
      let stroke: string;
      let textColor = COLORS.text;

      if (isEvent(el)) {
        const system = el.system || '';
        x = lanePositions[`event:${system}`];
        fill = COLORS.event;
        stroke = COLORS.eventStroke;
        
        svg += `
  <!-- Event: ${el.name} @${el.tick} -->
  <rect x="${x - LAYOUT.boxWidth / 2}" y="${y}" width="${LAYOUT.boxWidth}" height="${LAYOUT.boxHeight}" rx="${LAYOUT.boxRadius}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x}" y="${y + LAYOUT.boxHeight / 2}" fill="${textColor}" font-size="${LAYOUT.fontSize}" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle" font-weight="500">${escapeXml(truncateText(el.name))}</text>
`;
      } else if (isCommand(el)) {
        x = lanePositions['center'];
        fill = COLORS.command;
        stroke = COLORS.commandStroke;

        svg += `
  <!-- Command: ${el.name} @${el.tick} -->
  <rect x="${x - LAYOUT.boxWidth / 2}" y="${y}" width="${LAYOUT.boxWidth}" height="${LAYOUT.boxHeight}" rx="${LAYOUT.boxRadius}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x}" y="${y + LAYOUT.boxHeight / 2}" fill="${textColor}" font-size="${LAYOUT.fontSize}" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle" font-weight="500">${escapeXml(truncateText(el.name))}</text>
`;
      } else if (isState(el)) {
        x = lanePositions['center'];
        fill = COLORS.state;
        stroke = COLORS.stateStroke;

        svg += `
  <!-- State: ${el.name} @${el.tick} -->
  <rect x="${x - LAYOUT.boxWidth / 2}" y="${y}" width="${LAYOUT.boxWidth}" height="${LAYOUT.boxHeight}" rx="${LAYOUT.boxRadius}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x}" y="${y + LAYOUT.boxHeight / 2}" fill="${textColor}" font-size="${LAYOUT.fontSize}" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle" font-weight="500">${escapeXml(truncateText(el.name))}</text>
`;
      } else if (isActor(el)) {
        const role = el.role || '';
        x = lanePositions[`actor:${role}`];
        const colors = getActorColors(el.role);
        fill = colors.fill;
        stroke = colors.stroke;
        textColor = COLORS.textLight;

        svg += `
  <!-- Actor: ${el.name} @${el.tick} -->
  <ellipse cx="${x}" cy="${y + LAYOUT.boxHeight / 2}" rx="${LAYOUT.boxWidth / 2 - 5}" ry="${LAYOUT.boxHeight / 2 - 2}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
  <text x="${x}" y="${y + LAYOUT.boxHeight / 2}" fill="${textColor}" font-size="${LAYOUT.fontSize}" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle" font-weight="500">${escapeXml(truncateText(el.name))}</text>
`;
      }
    }
  });

  // Tick labels on the left
  svg += `\n  <!-- Tick labels -->`;
  tickColumns.forEach((column, tickIndex) => {
    const y = laneStartY + 20 + tickIndex * LAYOUT.tickGap + LAYOUT.boxHeight / 2;
    svg += `
  <text x="${LAYOUT.padding - 5}" y="${y}" fill="${COLORS.laneLabel}" font-size="8" font-family="${LAYOUT.fontFamily}" text-anchor="end" dominant-baseline="middle">@${column.tick}</text>
`;
  });

  // Legend at bottom
  const legendY = height - 15;
  const legendStartX = LAYOUT.padding;
  svg += `
  <!-- Legend -->
  <g class="legend" transform="translate(${legendStartX}, ${legendY})">
    <rect x="0" y="-8" width="40" height="14" rx="3" fill="${COLORS.event}" stroke="${COLORS.eventStroke}"/>
    <text x="20" y="0" fill="${COLORS.text}" font-size="7" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle">Event</text>
    
    <rect x="50" y="-8" width="50" height="14" rx="3" fill="${COLORS.command}" stroke="${COLORS.commandStroke}"/>
    <text x="75" y="0" fill="${COLORS.text}" font-size="7" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle">Command</text>
    
    <rect x="110" y="-8" width="40" height="14" rx="3" fill="${COLORS.state}" stroke="${COLORS.stateStroke}"/>
    <text x="130" y="0" fill="${COLORS.text}" font-size="7" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle">State</text>
    
    <ellipse cx="180" cy="0" rx="20" ry="7" fill="${COLORS.actor}" stroke="${COLORS.actorStroke}"/>
    <text x="180" y="0" fill="${COLORS.textLight}" font-size="7" font-family="${LAYOUT.fontFamily}" text-anchor="middle" dominant-baseline="middle">Actor</text>
  </g>
`;

  svg += `\n</svg>`;
  
  return svg;
}

/**
 * Download SVG file
 */
export function downloadSvg(model: GiraflowModel): void {
  const svg = generateSvg(model);
  
  const safeName = (model.name || 'giraflow')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}-event-model.svg`;
  link.click();
  URL.revokeObjectURL(url);
}
