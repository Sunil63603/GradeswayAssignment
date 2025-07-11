"use client";

import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function LessonForm({ onGenerate }) {
  const [form, setForm] = useState({
    topic: "",
    grade: "",
    concepts: "",
    materials: "",
    objectives: "",
    outline: [""],
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleOutlineChange = (index, value) => {
    const updated = [...form.outline];
    updated[index] = value;
    setForm((prev) => ({ ...prev, outline: updated }));
  };

  const addStep = () => {
    setForm((prev) => ({ ...prev, outline: [...prev.outline, ""] }));
  };

  return (
    <Card className="w-full h-full max-w-full p-6 space-y-4 overflow-y-auto overflow-x-hidden no-scrollbar  rounded-md shadow-inner">
      <CardTitle className="text-xl font-bold">✏️ Create Lesson Plan</CardTitle>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={form.topic}
            onChange={(e) => handleChange("topic", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade Level</Label>
          <Select onValueChange={(value) => handleChange("grade", value)}>
            <SelectTrigger id="grade">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Grade 1">Grade 1</SelectItem>
              <SelectItem value="Grade 2">Grade 2</SelectItem>
              <SelectItem value="Grade 3">Grade 3</SelectItem>
              <SelectItem value="Grade 4">Grade 4</SelectItem>
              <SelectItem value="Grade 5">Grade 5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="concepts">Main Concept & Subtopics</Label>
          <Textarea
            id="concepts"
            value={form.concepts}
            onChange={(e) => handleChange("concepts", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="materials">Materials Needed</Label>
          <Textarea
            id="materials"
            value={form.materials}
            onChange={(e) => handleChange("materials", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Learning Objectives</Label>
          <Textarea
            id="objectives"
            value={form.objectives}
            onChange={(e) => handleChange("objectives", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Lesson Outline</Label>
          <Accordion
            type="multiple"
            className="w-full bg-white rounded-md p-4 shadow-sm"
          >
            {form.outline.map((step, index) => (
              <AccordionItem key={index} value={`step-${index}`}>
                <AccordionTrigger>Step {index + 1}</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={step}
                    onChange={(e) => handleOutlineChange(index, e.target.value)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Button variant="ghost" onClick={addStep} className="mt-2">
            + Add Step
          </Button>
        </div>

        <Button className="w-full" onClick={() => onGenerate(form)}>
          Generate Lesson Plan
        </Button>
      </div>
    </Card>
  );
}
