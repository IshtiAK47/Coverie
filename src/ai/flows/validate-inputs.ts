'use server';
/**
 * @fileOverview Validates user inputs for cover page creation using AI.
 *
 * - validateInputs - A function that validates the inputs provided by the user.
 * - ValidateInputsInput - The input type for the validateInputs function.
 * - ValidateInputsOutput - The return type for the validateInputs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateInputsInputSchema = z.object({
  universityName: z.string().describe('The name of the university.'),
  department: z.string().describe('The department name.'),
  session: z.string().describe('The session information (e.g., Fall 2024).'),
  courseCode: z.string().describe('The course code (e.g., CS101).'),
  teacherName: z.string().describe('The name of the teacher or professor.'),
  designation: z.string().describe('The designation of the teacher (e.g., Professor, Instructor).'),
  studentName: z.string().describe('The name of the student.'),
  studentId: z.string().describe('The student ID number.'),
  submissionDate: z.string().describe('The submission date of the assignment or lab report.'),
  topic: z.string().optional().describe('The topic of the assignment or lab report, if applicable.'),
  documentType: z.enum(['assignment', 'lab report', 'general note']).describe('The type of document being created.'),
});
export type ValidateInputsInput = z.infer<typeof ValidateInputsInputSchema>;

const ValidateInputsOutputSchema = z.object({
  validatedUniversityName: z.string().describe('Validated university name.'),
  validatedDepartment: z.string().describe('Validated department name.'),
  validatedSession: z.string().describe('Validated session information.'),
  validatedCourseCode: z.string().describe('Validated course code.'),
  validatedTeacherName: z.string().describe('Validated teacher name.'),
  validatedDesignation: z.string().describe('Validated designation.'),
  validatedStudentName: z.string().describe('Validated student name.'),
  validatedStudentId: z.string().describe('Validated student ID.'),
  validatedSubmissionDate: z.string().describe('Validated submission date.'),
  validatedTopic: z.string().optional().describe('Validated topic, if applicable.'),
  suggestions: z.array(z.string()).describe('Suggestions for improvement or corrections.'),
});
export type ValidateInputsOutput = z.infer<typeof ValidateInputsOutputSchema>;

export async function validateInputs(input: ValidateInputsInput): Promise<ValidateInputsOutput> {
  return validateInputsFlow(input);
}

const validateInputsPrompt = ai.definePrompt({
  name: 'validateInputsPrompt',
  input: {schema: ValidateInputsInputSchema},
  output: {schema: ValidateInputsOutputSchema},
  prompt: `You are an AI assistant that validates user inputs for a cover page generator.

  Review the following inputs and identify any potential issues, such as incorrect date formats, 
  unusual student ID lengths, or excessively long titles. Provide suggestions for improvement.

  University Name: {{{universityName}}}
  Department: {{{department}}}
  Session: {{{session}}}
  Course Code: {{{courseCode}}}
  Teacher Name: {{{teacherName}}}
  Designation: {{{designation}}}
  Student Name: {{{studentName}}}
  Student ID: {{{studentId}}}
  Submission Date: {{{submissionDate}}}
  {{#if topic}}Topic: {{{topic}}}{{/if}}
  Document Type: {{{documentType}}}

  Provide validated versions of each input, and a list of suggestions for any necessary corrections or improvements.
  If the topic is missing respond with 'Topic: N/A'.
  Focus on format and length.
  Return the same input if valid.
  Output should be parsable and concise.
`,
});

const validateInputsFlow = ai.defineFlow(
  {
    name: 'validateInputsFlow',
    inputSchema: ValidateInputsInputSchema,
    outputSchema: ValidateInputsOutputSchema,
  },
  async input => {
    const {output} = await validateInputsPrompt(input);
    return output!;
  }
);
