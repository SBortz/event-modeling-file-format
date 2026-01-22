/**
 * Types for Information Flow models (copied from main project for independence)
 */

export interface EventReference {
  event: string;
  data?: unknown;
}

export interface CommandScenarioOutcome {
  produces?: EventReference[];
  fails?: string;
}

export interface CommandScenario {
  name: string;
  given: EventReference[];
  when?: unknown;
  then: CommandScenarioOutcome;
}

export interface StateViewScenario {
  name: string;
  given: EventReference[];
  then?: unknown;
}

export interface Event {
  type: 'event';
  name: string;
  tick: number;
  producedBy?: string;
  externalSource?: string;
  example?: unknown;
}

export interface StateView {
  type: 'state';
  name: string;
  tick: number;
  sourcedFrom: string[];
  example?: unknown;
  scenarios?: StateViewScenario[];
}

export interface Actor {
  type: 'actor';
  name: string;
  tick: number;
  readsView: string;
  sendsCommand: string;
}

export interface Command {
  type: 'command';
  name: string;
  tick: number;
  example?: unknown;
  scenarios?: CommandScenario[];
}

export type TimelineElement = Event | StateView | Actor | Command;

export interface InformationFlowModel {
  $schema?: string;
  name: string;
  description?: string;
  version?: string;
  timeline: TimelineElement[];
}

export type ViewMode = 'slice' | 'timeline' | 'table';
