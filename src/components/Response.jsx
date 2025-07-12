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
import { sections } from "@/app/page";

export default function ResponsePane({
  result,
  loadingSections,
  errorSections,
  editMode,
  setEditMode,
  prompt,
  setPrompt,
  onPromptSubmit,
  onDownload,
  onRetry,
  openSections,
  setOpenSections,
}) {
  const printRef = useRef();

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
        className="flex-1 overflow-y-auto max-w-full bg-muted/40 p-4 rounded-md shadow-inner no-scrollbar"
        ref={printRef}
      >
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="w-full bg-white rounded-md p-4 shadow-sm"
        >
          {sections.map((title, idx) => (
            <AccordionItem key={idx} value={`section-${idx}`}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                {loadingSections?.[title] ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[100px] w-full" />
                    <p className="text-sm text-muted-foreground text-center">
                      Generating {title} ...
                    </p>
                  </div>
                ) : errorSections?.[title] ? (
                  <Alert variant="destructive" className="flex flex-col gap-2">
                    <AlertTitle>{errorSections[title]}</AlertTitle>
                    <Button size="sm" onClick={() => onRetry(title)}>
                      Retry
                    </Button>
                  </Alert>
                ) : result?.[title] ? (
                  editMode ? (
                    <Textarea
                      value={result[title] || ""}
                      onChange={(e) => {
                        result[title] = e.target.value;
                      }}
                    />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {result[title]}
                    </p>
                  )
                ) : (
                  <p className="italic text-sm text-muted-foreground">
                    No content yet.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onPromptSubmit(prompt);
          setPrompt("");
        }}
        className="mt-4"
      >
        <div className="flex items-center justify-center">
          <Input
            placeholder="Type your prompt…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </Card>
  );
}
