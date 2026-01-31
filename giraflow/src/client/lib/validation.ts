/**
 * Client-side JSON validation for the editor
 */

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate JSON string - basic structural validation
 * Note: Full schema validation could be added with AJV if needed
 */
export function validateJson(jsonString: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!jsonString.trim()) {
    return { valid: false, errors: [{ path: '', message: 'JSON is empty' }] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Invalid JSON';
    return { valid: false, errors: [{ path: '', message: error }] };
  }

  // Basic structural validation for Giraflow models
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    errors.push({ path: '', message: 'Root must be an object' });
    return { valid: false, errors };
  }

  const model = parsed as Record<string, unknown>;

  // Check required fields
  if (typeof model.name !== 'string' || !model.name) {
    errors.push({ path: '/name', message: 'name is required and must be a string' });
  }

  if (!Array.isArray(model.timeline)) {
    errors.push({ path: '/timeline', message: 'timeline is required and must be an array' });
  } else {
    // Validate timeline elements
    model.timeline.forEach((element, index) => {
      if (typeof element !== 'object' || element === null) {
        errors.push({ path: `/timeline/${index}`, message: 'must be an object' });
        return;
      }

      const el = element as Record<string, unknown>;

      if (!['event', 'state', 'command', 'actor'].includes(el.type as string)) {
        errors.push({
          path: `/timeline/${index}/type`,
          message: `type must be one of: event, state, command, actor`
        });
      }

      if (typeof el.name !== 'string' || !el.name) {
        errors.push({ path: `/timeline/${index}/name`, message: 'name is required' });
      }

      if (typeof el.tick !== 'number') {
        errors.push({ path: `/timeline/${index}/tick`, message: 'tick is required and must be a number' });
      }

      // Type-specific validation
      if (el.type === 'state' && !Array.isArray(el.sourcedFrom)) {
        errors.push({ path: `/timeline/${index}/sourcedFrom`, message: 'sourcedFrom is required for state' });
      }

      if (el.type === 'actor') {
        if (typeof el.readsView !== 'string' && !Array.isArray(el.readsView)) {
          errors.push({ path: `/timeline/${index}/readsView`, message: 'readsView is required for actor' });
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  return errors.map(e => `${e.path || '/'}: ${e.message}`).join('\n');
}
