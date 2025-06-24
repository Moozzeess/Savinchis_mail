'use server';

/**
 * @fileOverview A flow that uses AI to suggest improvements for email content to avoid spam filters and increase engagement.
 *
 * - optimizeEmailContent - A function that optimizes email content using AI.
 * - OptimizeEmailContentInput - The input type for the optimizeEmailContent function.
 * - OptimizeEmailContentOutput - The return type for the optimizeEmailContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeEmailContentInputSchema = z.object({
  emailContent: z.string().describe('The email content to be optimized.'),
  audience: z.string().describe('Description of the target audience.'),
});
export type OptimizeEmailContentInput = z.infer<
  typeof OptimizeEmailContentInputSchema
>;

const OptimizeEmailContentOutputSchema = z.object({
  optimizedContent: z
    .string()
    .describe('The optimized email content with suggestions.'),
  spamScore: z
    .number()
    .optional()
    .describe('A score indicating the likelihood of being flagged as spam.'),
  engagementSuggestions: z
    .string()
    .optional()
    .describe('Suggestions to improve audience engagement.'),
});
export type OptimizeEmailContentOutput = z.infer<
  typeof OptimizeEmailContentOutputSchema
>;

export async function optimizeEmailContent(
  input: OptimizeEmailContentInput
): Promise<OptimizeEmailContentOutput> {
  return optimizeEmailContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeEmailContentPrompt',
  input: {schema: OptimizeEmailContentInputSchema},
  output: {schema: OptimizeEmailContentOutputSchema},
  prompt: `You are an AI assistant specializing in email marketing. Your goal is to help users optimize their email content to avoid spam filters and increase engagement.

  Consider the following email content and target audience:

  Email Content: {{{emailContent}}}
  Target Audience: {{{audience}}}

  Provide the optimized email content with clear suggestions on how to improve it, including specific changes to avoid spam triggers and enhance engagement. Also, provide a spam score indicating the likelihood of the email being flagged as spam (lower is better) and engagement suggestions to improve audience engagement.
  Remember to re-write the email entirely using the instructions given.
`,
});

const optimizeEmailContentFlow = ai.defineFlow(
  {
    name: 'optimizeEmailContentFlow',
    inputSchema: OptimizeEmailContentInputSchema,
    outputSchema: OptimizeEmailContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
