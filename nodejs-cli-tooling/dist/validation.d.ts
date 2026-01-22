/**
 * Validate a JSON document against a JSON Schema
 */
export declare function validateAgainstSchema(json: unknown, schemaPath: string): Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Print validation result
 */
export declare function printValidationResult(result: {
    valid: boolean;
    errors: string[];
}): void;
