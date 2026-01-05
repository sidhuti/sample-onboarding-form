import { z } from 'zod';

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or less'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be 50 characters or less'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^\+1\d{10}$/,
      'Invalid Canadian phone number. Must start with +1 followed by 10 digits'
    ),
  
  corporationNumber: z
    .string()
    .length(9, 'Corporation number must be exactly 9 characters'),
});

export type OnboardingFormSchema = z.infer<typeof onboardingSchema>;
