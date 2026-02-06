import { useMemo } from 'react';
import type { Page } from '@/lib/types';
import { validatePage, canAddColumn, getSuggestedColumnSizes } from '@/lib/validation';

export function useColumnValidation(page: Page | undefined) {
  return useMemo(() => {
    if (!page) {
      return {
        validation: { valid: true, errors: [], warnings: [] },
        canAddColumn: () => ({ canAdd: false, reason: 'No page selected' }),
        suggestedSizes: [],
      };
    }

    const validation = validatePage(page);

    return {
      validation,
      canAddColumn: (size: 'small' | 'full') => canAddColumn(page, size),
      suggestedSizes: getSuggestedColumnSizes(page),
    };
  }, [page]);
}
