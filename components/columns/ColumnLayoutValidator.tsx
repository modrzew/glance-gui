'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import type { ValidationResult } from '@/lib/validation';

const ErrorIcon = AlertCircle;
const WarningIcon = AlertTriangle;

interface ColumnLayoutValidatorProps {
  validation: ValidationResult;
}

export function ColumnLayoutValidator({ validation }: ColumnLayoutValidatorProps) {
  if (validation.valid && validation.warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {validation.errors.map((error, index) => (
        <Alert key={`error-${index}`} variant="destructive">
          <ErrorIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
      {validation.warnings.map((warning, index) => (
        <Alert key={`warning-${index}`}>
          <WarningIcon className="h-4 w-4" />
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
