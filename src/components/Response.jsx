"use client";

import { Card, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef } from "react";

export default function ResponsePane({
  loading,
  error,
  result,
  editMode,
  setEditMode,
  prompt,
  setPrompt,
  onPromptSubmit,
  onDownload,
}) {
  const printRef = useRef();

  const displaySections = [
    "Detailed Lesson Content",
    "Suggested Classroom Activities",
    "Assessment Questions",
  ];

  return (
    <Card className="w-full p-6 space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">
          📄 Lesson Output
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={editMode} onCheckedChange={setEditMode} />
            <span>Edit Mode</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(printRef)}
          >
            Download as PDF
          </Button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent max-w-full shadow-inner"
        ref={printRef}
      >
        {loading ? (
          <Skeleton className="h-[500px] w-full" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        ) : result ? (
          <Accordion type="multiple" className="w-full">
            {displaySections.map((title, idx) => (
              <AccordionItem key={idx} value={`section-${idx}`}>
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>
                  {editMode ? (
                    <Textarea
                      value={result[title] || ""}
                      onChange={(e) => (result[title] = e.target.value)}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {result[title]}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card className="italic text-center p-6">
            Your lesson plan will appear here.
          </Card>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPromptSubmit(prompt);
        }}
        className="mt-4"
      >
        <Input
          placeholder="Type your prompt…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </form>
    </Card>
  );
}
