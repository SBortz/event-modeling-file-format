/**
 * Type guards for timeline elements
 */
export function isEvent(element) {
    return element.type === 'event';
}
export function isStateView(element) {
    return element.type === 'state';
}
export function isActor(element) {
    return element.type === 'actor';
}
export function isCommand(element) {
    return element.type === 'command';
}
