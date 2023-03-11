import { ValidationRule } from '@prefecthq/vue-compositions'

export const stringHasValue: ValidationRule<string | undefined | null> = (value, label) => {
  if (value !== undefined && value !== null && value.trim().length > 0) {
    return true
  }

  return `${label} is required`
}