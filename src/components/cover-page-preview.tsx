"use client";

import type { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import type { CoverPageData } from "@/app/page";
import { Separator } from "./ui/separator";

function Title({ text }: { text: string }) {
  return <h2 className="text-2xl font-bold text-primary tracking-tight text-center">{text}</h2>;
}

function SubmittedTo({ name, designation }: { name:string, designation: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-primary">Submitted To</h3>
      <Separator className="my-2 bg-primary/20"/>
      <p className="text-lg text-foreground">{name || "Teacher Name"}</p>
      <p className="text-md text-muted-foreground">{designation || "Designation"}</p>
    </div>
  );
}

function SubmittedBy({ name, id }: { name: string, id: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-primary">Submitted By</h3>
      <Separator className="my-2 bg-primary/20"/>
      <p className="text-lg text-foreground">{name || "Student Name"}</p>
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
      <CardContent className="p-12 flex flex-col h-full font-serif">
        <header className="flex flex-col items-center text-center mb-16">
          <div className="mb-4">
             <Image
                src="https://placehold.co/120x120.png"
                alt="University Logo"
                width={120}
                height={120}
                className="rounded-full"
                data-ai-hint="university logo"
              />
          </div>
          <h1 className="text-4xl font-extrabold text-primary tracking-wider uppercase">
            {universityName}
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Department of {data.department || "..."}
          </p>
        </header>

        <main className="flex-grow flex flex-col justify-center items-center text-center space-y-8">
            <Title text={getTitle()} />
            <div className="text-center">
                <p className="text-lg font-medium text-foreground">Course: {data.courseCode || "Course Code"}</p>
                <p className="text-lg font-medium text-foreground">Session: {data.session || "Session"}</p>
            </div>
        </main>

        <footer className="mt-16">
            <div className="grid grid-cols-2 gap-12">
                <SubmittedTo name={data.teacherName} designation={data.designation} />
                <SubmittedBy name={data.studentName} id={data.studentId} />
            </div>
            <div className="text-center mt-12 pt-4 border-t border-border">
                <p className="text-md text-muted-foreground">
                    Submission Date: {data.submissionDate ? format(data.submissionDate, "do MMMM, yyyy") : "Date of Submission"}
                </p>
            </div>
        </footer>
      </CardContent>
    </Card>
  );
}
