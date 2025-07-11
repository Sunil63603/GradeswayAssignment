"use client";

import LessonForm from "@/components/LessonForm";
import ResponsePane from "@/components/Response";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleGenerate = (form) => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setResult({
        Topic: form.topic,
        "Grade Level": form.grade,
        "Main Concepts": form.concepts,
        "Materials Needed": form.materials,
        "Learning Objectives": form.objectives,
        "Lesson Outline": form.outline.join("\n\n"),
        Assessment: "Assessment content generated here.",
      });
      setLoading(false);
    }, 1000);
  };

  const handlePromptSubmit = (text) => {
    console.log("Prompt submitted:", text);
  };

  const handleDownload = (ref) => {
    // window.print(); // placeholder logic for now
  };

  return (
    <div className="flex gap-4 h-screen p-4 bg-muted">
      <div className="w-[40%] h-full">
        <LessonForm onGenerate={handleGenerate} />
      </div>
      <div className="w-[60%] h-full">
        <ResponsePane
          loading={loading}
          error={error}
          result={result}
          editMode={editMode}
          setEditMode={setEditMode}
          prompt={prompt}
          setPrompt={setPrompt}
          onPromptSubmit={handlePromptSubmit}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}
