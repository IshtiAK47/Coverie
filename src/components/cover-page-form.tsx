"use client";

import type { UseFormReturn } from "react-hook-form";
import React, { useState, useEffect, useTransition } from "react";
import * as z from "zod";
import { format } from "date-fns";
import {
  Building2,
  CalendarClock,
  FileCode,
  User,
  Briefcase,
  Hash,
  Calendar as CalendarIcon,
  BookOpen,
  FileText,
  FlaskConical,
  StickyNote,
  Sparkles,
  Download,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { validateInputsAction } from "@/lib/actions";
import type { CoverPageData } from "@/app/page";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export const formSchema = z.object({
  department: z.string().min(2, "Department is required."),
  session: z.string().min(3, "Session is required."),
  courseCode: z.string().min(3, "Course code is required."),
  teacherName: z.string().min(3, "Teacher's name is required."),
  designation: z.string().min(3, "Designation is required."),
  studentName: z.string().min(3, "Your name is required."),
  studentId: z.string().min(3, "Your ID is required."),
  submissionDate: z.date({
    required_error: "Submission date is required.",
  }),
  topic: z.string().optional(),
  documentType: z.enum(["assignment", "lab report", "general note"]),
});

type InputFieldProps = {
  name: keyof Omit<CoverPageData, 'department' | 'submissionDate' | 'documentType' | 'topic'>;
  label: string;
  placeholder: string;
  icon: React.ElementType;
};

const inputFields: InputFieldProps[] = [
  { name: "session", label: "Session", placeholder: "e.g. Fall 2024", icon: CalendarClock },
  { name: "courseCode", label: "Course Code", placeholder: "e.g. CSE-101", icon: FileCode },
  { name: "teacherName", label: "Teacher's Name", placeholder: "e.g. Dr. Alan Turing", icon: User },
  { name: "designation", label: "Teacher's Designation", placeholder: "e.g. Professor", icon: Briefcase },
  { name: "studentName", label: "Your Name", placeholder: "e.g. Ada Lovelace", icon: User },
  { name: "studentId", label: "Your Student ID", placeholder: "e.g. 20240001", icon: Hash },
];

export default function CoverPageForm({ form }: { form: UseFormReturn<CoverPageData> }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [savedTopics, setSavedTopics] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const documentType = form.watch("documentType");

  useEffect(() => {
    try {
      const topics = localStorage.getItem("savedTopics");
      if (topics) {
        setSavedTopics(JSON.parse(topics));
      }
    } catch (error) {
      console.error("Failed to parse topics from localStorage", error);
    }
  }, []);

  const handleTopicBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const newTopic = e.target.value.trim();
    if (newTopic && !savedTopics.includes(newTopic)) {
      const updatedTopics = [...savedTopics, newTopic];
      setSavedTopics(updatedTopics);
      localStorage.setItem("savedTopics", JSON.stringify(updatedTopics));
    }
  };
  
  const onValidate = (formData: CoverPageData) => {
    setAiSuggestions([]);
    startTransition(async () => {
      const dataForAI = {
        ...formData,
        universityName: "Chandpur Science and Technology",
        submissionDate: formData.submissionDate.toLocaleDateString('en-CA'),
      };
      
      const result = await validateInputsAction(dataForAI);
      if (result.success && result.data) {
        toast({
          title: "Validation Complete",
          description: "AI has reviewed your inputs.",
        });
        if (result.data.suggestions.length > 0) {
          setAiSuggestions(result.data.suggestions);
        } else {
          setAiSuggestions(["All inputs look good!"]);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Validation Failed",
          description: result.error,
        });
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onValidate)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Cover Page</CardTitle>
            <CardDescription>Fill in the details to generate your cover page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Document Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="assignment" /></FormControl>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="font-normal">Assignment</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="lab report" /></FormControl>
                        <FlaskConical className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="font-normal">Lab Report</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl><RadioGroupItem value="general note" /></FormControl>
                        <StickyNote className="h-4 w-4 text-muted-foreground" />
                        <FormLabel className="font-normal">General Note</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(documentType === "assignment" || documentType === "lab report") && (
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input list="saved-topics" placeholder="e.g. Data Structures Analysis" className="pl-10" {...field} onBlur={handleTopicBlur} />
                        <datalist id="saved-topics">
                          {savedTopics.map(topic => <option key={topic} value={topic} />)}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </div>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CSE">CSE</SelectItem>
                        <SelectItem value="ICT">ICT</SelectItem>
                        <SelectItem value="BBA">BBA</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {inputFields.map(({ name, label, placeholder, icon: Icon }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder={placeholder} className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="submissionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Submission Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {aiSuggestions.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>AI Suggestions</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1">
                    {aiSuggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              {isPending ? "Validating..." : "Validate with AI"}
            </Button>
            <Button type="button" variant="secondary" onClick={handlePrint} className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
