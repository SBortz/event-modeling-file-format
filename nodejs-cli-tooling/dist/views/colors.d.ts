import chalk from 'chalk';
/**
 * Color theme for consistent styling across all views
 */
export declare const colors: {
    event: import("chalk").ChalkInstance;
    state: import("chalk").ChalkInstance;
    command: import("chalk").ChalkInstance;
    actor: import("chalk").ChalkInstance;
    dim: import("chalk").ChalkInstance;
    bold: import("chalk").ChalkInstance;
    cyan: import("chalk").ChalkInstance;
    yellow: import("chalk").ChalkInstance;
    red: import("chalk").ChalkInstance;
    green: import("chalk").ChalkInstance;
    grey: import("chalk").ChalkInstance;
    white: import("chalk").ChalkInstance;
    eventBold: import("chalk").ChalkInstance;
    stateBold: import("chalk").ChalkInstance;
    commandBold: import("chalk").ChalkInstance;
    actorBold: import("chalk").ChalkInstance;
    symbols: {
        event: string;
        state: string;
        command: string;
        actor: string;
        timelineLine: string;
        timelineEnd: string;
        arrow: string;
        arrowLeft: string;
        bullet: string;
    };
};
/**
 * Format element name with appropriate color based on type
 */
export declare function formatElement(type: string, name: string, bold?: boolean): string;
/**
 * Get symbol and color for element type
 */
export declare function getElementStyle(type: string): {
    symbol: string;
    color: typeof chalk;
};
/**
 * Create a horizontal rule
 */
export declare function rule(text?: string, style?: 'full' | 'left' | 'center'): string;
/**
 * Create a box around text
 */
export declare function box(content: string, options?: {
    borderColor?: typeof chalk;
    padding?: number;
}): string;
