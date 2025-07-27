"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import CoverPageForm from "@/components/cover-page-form";
import CoverPagePreview from "@/components/cover-page-preview";
import { formSchema } from "@/components/cover-page-form";

export type CoverPageData = z.infer<typeof formSchema>;

export default function Home() {
  const form = useForm<CoverPageData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "CSE",
      session: "",
      courseCode: "",
      teacherName: "",
      designation: "",
      studentName: "",
      studentId: "",
      submissionDate: new Date(),
      topic: "",
      documentType: "assignment",
    },
    mode: "onBlur"
  });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md no-print">
        <h1 className="text-2xl font-bold font-headline">Coverie</h1>
      </header>
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2">
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto no-print">
          <CoverPageForm form={form} />
        </div>
        <div className="bg-secondary/40 p-4 sm:p-6 md:p-8 flex items-center justify-center printable-area-container">
          <div className="printable-area w-full h-full">
            <CoverPagePreview form={form} />
          </div>
        </div>
      </main>
    </div>
  );
}
