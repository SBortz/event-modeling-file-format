/**
 * Slice CSV Export
 *
 * Exports a single slice's occurrences as CSV.
 */

import type { Slice } from './slice-model';

export interface CsvRow {
  tick: number;
  name: string;
  type: 'state' | 'command';
  example: string;
  relatedEvents: string;
}

/**
 * Escape a value for CSV (handle commas, quotes, newlines).
 */
function escapeCsvValue(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert a slice to CSV rows.
 */
export function sliceToCsvRows(slice: Slice): CsvRow[] {
  if (slice.type === 'state') {
    return slice.stateOccurrences.map((occ) => ({
      tick: occ.tick,
      name: slice.name,
      type: 'state' as const,
      example: occ.state.example !== undefined ? JSON.stringify(occ.state.example) : '',
      relatedEvents: occ.state.sourcedFrom.join(', '),
    }));
  } else {
    return slice.commandOccurrences.map((occ) => ({
      tick: occ.tick,
      name: slice.name,
      type: 'command' as const,
      example: occ.command.example !== undefined ? JSON.stringify(occ.command.example) : '',
      relatedEvents: occ.producedEvents.map((e) => e.name).join(', '),
    }));
  }
}

/**
 * Convert CSV rows to CSV string.
 */
export function rowsToCsvString(rows: CsvRow[]): string {
  const headers = ['tick', 'name', 'type', 'example', 'relatedEvents'];
  const headerLine = headers.join(',');

  const dataLines = rows.map((row) =>
    [
      String(row.tick),
      escapeCsvValue(row.name),
      row.type,
      escapeCsvValue(row.example),
      escapeCsvValue(row.relatedEvents),
    ].join(',')
  );

  return [headerLine, ...dataLines].join('\n');
}

/**
 * Export a slice as CSV string.
 */
export function exportSliceToCsv(slice: Slice): string {
  const rows = sliceToCsvRows(slice);
  return rowsToCsvString(rows);
}

/**
 * Trigger a CSV file download in the browser.
 */
export function downloadSliceCsv(slice: Slice): void {
  const csv = exportSliceToCsv(slice);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${slice.type}-${slice.name}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
