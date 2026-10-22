import type {FieldError, FieldErrors, FieldValues, Resolver} from 'react-hook-form';
import type {z} from 'zod';

/**
 * Minimal zod → react-hook-form resolver (flat field paths). Avoids pulling in
 * @hookform/resolvers for a single form.
 */
export function zodResolver<TValues extends FieldValues>(schema: z.ZodType<unknown, TValues>): Resolver<TValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);
    if (result.success) {
      return {values, errors: {}};
    }
    const errors: Record<string, FieldError> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.map(String).join('.');
      if (!errors[key]) errors[key] = {type: issue.code, message: issue.message};
    }
    return {values: {}, errors: errors as FieldErrors<TValues>};
  };
}
