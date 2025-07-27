
"use client";

import type { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { format } from "date-fns";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { CoverPageData } from "@/app/page";
import { Separator } from "./ui/separator";

function Title({ text }: { text: string }) {
  return <h2 className="text-3xl font-bold text-primary tracking-tight text-center">{text}</h2>;
}

function SubmittedTo({ name, designation }: { name:string, designation: string }) {
  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-primary/80 mb-2 uppercase tracking-wider">Submitted To</h3>
      <p className="text-lg font-semibold text-foreground">{name || "Teacher Name"}</p>
      <p className="text-md text-muted-foreground">{designation || "Designation"}</p>
    </div>
  );
}

function SubmittedBy({ name, id }: { name: string, id: string }) {
    return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-primary/80 mb-2 uppercase tracking-wider">Submitted By</h3>
      <p className="text-lg font-semibold text-foreground">{name || "Student Name"}</p>
      <p className="text-md text-muted-foreground">ID: {id || "Student ID"}</p>
    </div>
  );
}

export default function CoverPagePreview({ form }: { form: UseFormReturn<CoverPageData> }) {
  const data = form.watch();
  const universityName = "Chandpur Science and Technology";

  const getTitle = () => {
    const docType = data.documentType || "document";
    const capitalizedDocType = docType.charAt(0).toUpperCase() + docType.slice(1);
    
    if ((docType === 'assignment' || docType === 'lab report') && data.topic) {
      return `${capitalizedDocType} on "${data.topic}"`;
    }
    return capitalizedDocType;
  }
  
  return (
    <Card id="cover-page-preview" className="w-full aspect-[210/297] max-w-[794px] max-h-[1123px] shadow-lg bg-white overflow-hidden">
      <CardContent className="p-12 flex flex-col h-full">
        <header className="flex flex-col items-center text-center mb-12">
          <div className="mb-4">
             <Image
                src="public/logo.png"
                alt="University Logo"
                width={100}
                height={100}
                className="rounded-full shadow-md"
                data-ai-hint="university logo"
              />
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-wide">
            {universityName}
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Department of {data.department || "..."}
          </p>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center text-center space-y-6">
            <Title text={getTitle()} />
            <div className="text-center">
                <p className="text-lg font-medium text-foreground">Course Code: {data.courseCode || "..."}</p>
                <p className="text-md text-muted-foreground">Session: {data.session || "..."}</p>
            </div>
        </main>

        <footer className="mt-12 space-y-8">
            <div className="grid grid-cols-2 gap-8">
                <SubmittedTo name={data.teacherName} designation={data.designation} />
                <SubmittedBy name={data.studentName} id={data.studentId} />
            </div>
            <div className="text-center pt-6 border-t-2 border-dashed border-border">
                <p className="text-sm font-semibold text-primary/80 uppercase tracking-wider mb-2">
                    Submission Date
                </p>
                <p className="text-lg text-foreground">
                    {data.submissionDate ? format(data.submissionDate, "do MMMM, yyyy") : "..."}
                </p>
            </div>
        </footer>
      </CardContent>
    </Card>
  );
}
