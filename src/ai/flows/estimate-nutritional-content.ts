// The estimateNutritionalContentFlow estimates the nutritional content of a meal from a textual description of the meal's contents.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateNutritionalContentInputSchema = z.object({
  foodItemsDescription: z
    .string()
    .describe(
      'A description of the food items in the meal, e.g. "a bowl of pasta with tomato sauce and meatballs".'
    ),
});
export type EstimateNutritionalContentInput =
  z.infer<typeof EstimateNutritionalContentInputSchema>;

const EstimateNutritionalContentOutputSchema = z.object({
  calories: z.number().describe('The estimated number of calories in the meal.'),
  protein: z.number().describe('The estimated grams of protein in the meal.'),
  fat: z.number().describe('The estimated grams of fat in the meal.'),
  carbohydrates: z.number().describe('The estimated grams of carbohydrates in the meal.'),
  analysis: z
    .string()
    .describe(
      'A textual description of the nutritional analysis, including the estimated calories, protein, fats, and carbohydrates.'
    ),
});
export type EstimateNutritionalContentOutput =
  z.infer<typeof EstimateNutritionalContentOutputSchema>;

export async function estimateNutritionalContent(
  input: EstimateNutritionalContentInput
): Promise<EstimateNutritionalContentOutput> {
  return estimateNutritionalContentFlow(input);
}

const estimateNutritionalContentPrompt = ai.definePrompt({
  name: 'estimateNutritionalContentPrompt',
  input: {schema: EstimateNutritionalContentInputSchema},
  output: {schema: EstimateNutritionalContentOutputSchema},
  prompt: `You are a nutritional expert. Given the following description of a meal, estimate the nutritional content (calories, protein, fats, carbs) of the meal.

Description: {{{foodItemsDescription}}}

Output a textual description of the analysis, including the estimated calories, protein, fats, and carbohydrates.

{{outputFormatInstructions}}`,
});

const estimateNutritionalContentFlow = ai.defineFlow(
  {
    name: 'estimateNutritionalContentFlow',
    inputSchema: EstimateNutritionalContentInputSchema,
    outputSchema: EstimateNutritionalContentOutputSchema,
  },
  async input => {
    const {output} = await estimateNutritionalContentPrompt(input);
    return output!;
  }
);
