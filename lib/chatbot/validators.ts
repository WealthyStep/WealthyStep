import { z } from 'zod';
import { LeadServiceOption } from './types';

// Zod Schema for the complete Lead Data
// This is used for both client-side and server-side validation.

export const leadDataSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(50, { message: 'Name must not exceed 50 characters.' })
    .transform((val) => val.trim()),
    
  phone: z
    .string()
    .regex(/^(?:\+91|91)?(?:[ -])?(?:[6-9]\d{9})$/, { 
      message: 'Please enter a valid 10-digit Indian mobile number.' 
    })
    .transform((val) => val.replace(/\D/g, '').slice(-10)),
    
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .max(100, { message: 'Email must not exceed 100 characters.' })
    .transform((val) => val.toLowerCase().trim()),
    
  service: z.enum([
    'Mutual Fund Distribution',
    'Insurance',
    'NRI Services',
    'Calculators / Website Help',
    'Other'
  ], {
    message: 'Please select a valid service option.'
  }),
  
  message: z
    .string()
    .min(2, { message: 'Message must be at least 2 characters long.' })
    .max(1000, { message: 'Message must not exceed 1000 characters.' })
    .transform((val) => val.trim()),
    
  // Honeypot field - must be empty
  website: z.string().optional(),
  source: z.string().optional().default('Website')
});

// Helper type for validated data
export type ValidatedLeadData = z.infer<typeof leadDataSchema>;
