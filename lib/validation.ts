import type { Column, ColumnSize, Page } from './types';
import { VALID_COLUMN_LAYOUTS } from './constants';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a column layout array
 */
export function validateColumnLayout(columns: Column[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Must have at least one column
  if (columns.length === 0) {
    errors.push('Page must have at least one column');
    return { valid: false, errors, warnings };
  }

  // Maximum 3 columns
  if (columns.length > 3) {
    errors.push('Page cannot have more than 3 columns');
    return { valid: false, errors, warnings };
  }

  // Check if layout matches valid patterns
  const layout = columns.map(c => c.size);
  const layoutString = JSON.stringify(layout);
  const isValid = VALID_COLUMN_LAYOUTS.some(
    validLayout => JSON.stringify(validLayout) === layoutString
  );

  if (!isValid) {
    errors.push(
      `Invalid column layout: [${layout.join(', ')}]. Valid layouts are: ${VALID_COLUMN_LAYOUTS.map(
        l => `[${l.join(', ')}]`
      ).join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a page configuration
 */
export function validatePage(page: Page): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate page name
  if (!page.name || page.name.trim() === '') {
    errors.push('Page name is required');
  }

  // Validate columns
  const columnValidation = validateColumnLayout(page.columns);
  errors.push(...columnValidation.errors);
  warnings.push(...columnValidation.warnings);

  // Slim pages: max 2 columns
  if (page.width === 'slim' && page.columns.length > 2) {
    errors.push('Slim pages can have a maximum of 2 columns');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Checks if a new column can be added to a page
 */
export function canAddColumn(page: Page, size: ColumnSize): {
  canAdd: boolean;
  reason?: string;
} {
  const currentLayout = page.columns.map(c => c.size);
  const newLayout = [...currentLayout, size];

  // Check maximum columns
  if (newLayout.length > 3) {
    return { canAdd: false, reason: 'Maximum 3 columns allowed' };
  }

  // Check slim page limit
  if (page.width === 'slim' && newLayout.length > 2) {
    return { canAdd: false, reason: 'Slim pages can have maximum 2 columns' };
  }

  // Check if new layout is valid
  const layoutString = JSON.stringify(newLayout);
  const isValid = VALID_COLUMN_LAYOUTS.some(
    validLayout => JSON.stringify(validLayout) === layoutString
  );

  if (!isValid) {
    return {
      canAdd: false,
      reason: `Layout [${newLayout.join(', ')}] is not valid. Try adding a different size.`,
    };
  }

  return { canAdd: true };
}

/**
 * Get suggested column sizes that can be added to a page
 */
export function getSuggestedColumnSizes(page: Page): ColumnSize[] {
  const currentLayout = page.columns.map(c => c.size);
  const suggestions: ColumnSize[] = [];

  for (const size of ['small', 'full'] as ColumnSize[]) {
    const result = canAddColumn(page, size);
    if (result.canAdd) {
      suggestions.push(size);
    }
  }

  return suggestions;
}
