"use client";

import LessonForm from "@/components/LessonForm";
import ResponsePane from "@/components/Response";
import { useState } from "react";
// import { generateLesson } from "@/lib/generateLesson";
import { generateSection } from "@/lib/generateLesson";
import jsPDF from "jspdf";

//reuse this array in Response.jsx file as well
export const sections = [
  "Detailed Lesson Content",
  "Suggested Classroom Activities",
  "Assessment Questions",
];

export default function Home() {
  const [loadingSections, setLoadingSections] = useState({});
  const [errorSections, setErrorSections] = useState({});
  const [result, setResult] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [formInputs, setFormInputs] = useState(null);
  const [openSections, setOpenSections] = useState([]);

  const handleGenerate = async (form) => {
    setFormInputs(form);
    setResult({});
    setErrorSections({});
    setOpenSections(["section-0"]);

    const promptText = `Topic: ${form.topic}\nGrade Level:${
      form.grade
    }\nMain Concepts: ${form.concepts}\nMaterials Needed: ${
      form.materials
    }\nLearning Objectives: ${
      form.objectives
    }\nLesson Outline: ${form.outline.join("\n")}`;

    for (const section of sections) {
      setLoadingSections((prev) => ({ ...prev, [section]: true }));
      try {
        const response = await generateSection(promptText, section);
        setResult((prev) => ({ ...prev, [section]: response }));
      } catch (err) {
        console.error(err);
        setErrorSections((prev) => ({
          ...prev,
          [section]: "Failed to generate.",
        }));
      } finally {
        setLoadingSections((prev) => ({ ...prev, [section]: false }));
      }

      //wait 2 seconds before next call to avoid 429
      await new Promise((res) => setTimeout(res, 1000));
    }
  };

  const handlePromptSubmit = async (text) => {
    setOpenSections(["section-0"]);

    if (!formInputs) return;
    const promptText = `${text}\n\nTopic: ${formInputs.topic}\nGrade Level: ${
      formInputs.grade
    }\nMain Concepts: ${formInputs.concepts}\nMaterials Needed: ${
      formInputs.materials
    }\nLearning Objectives: ${
      formInputs.objectives
    }\nLesson Outline: ${formInputs.outline.join("\n")}`;

    setResult({});
    setErrorSections({});

    for (const section of sections) {
      setLoadingSections((prev) => ({ ...prev, [section]: true }));
      try {
        const response = await generateSection(promptText, section);
        setResult((prev) => ({ ...prev, [section]: response }));
        // setErrorSections((prev) => ({ ...prev, [section]: null }));
      } catch (err) {
        console.error(err);
        setErrorSections((prev) => ({
          ...prev,
          [section]: "Failed to regenerate.",
        }));
      } finally {
        setLoadingSections((prev) => ({ ...prev, [section]: false }));
      }

      //wait 2 seconds before next call to avoid 429.
      await new Promise((res) => setTimeout(res, 1000));
    }
  };

  const retrySection = async (section) => {
    if (!formInputs) return;
    const promptText = `${prompt}\n\nTopic: ${formInputs.topic}\nGrade Level: ${
      formInputs.grade
    }\nMain Concepts: ${formInputs.concepts}\nMaterials Needed: ${
      formInputs.materials
    }\nLearning Objectives: ${
      formInputs.objectives
    }\nLesson Outline: ${formInputs.outline.join("\n")}`;

    setLoadingSections((prev) => ({ ...prev, [section]: true }));
    setErrorSections((prev) => ({ ...prev, [section]: null }));

    try {
      const response = await generateSection(promptText, section);
      setResult((prev) => ({ ...prev, [section]: response }));
    } catch (err) {
      console.error(err);
      setErrorSections((prev) => ({ ...prev, [section]: "Retry failed." }));
    } finally {
      setLoadingSections((prev) => ({ ...prev, [section]: false }));
    }
  };

  const handleDownload = () => {
    if (!formInputs?.topic || !result) {
      alert("Please generate a lesson plan first");
      return;
    }

    // Defer execution to allow layout/styling to settle
    setTimeout(() => {
      const doc = new jsPDF("p", "pt", "a4");
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 40;
      const lineHeight = 18;
      const sectionGap = 30;
      const maxWidth = pageWidth - margin * 2;

      let y = margin;
      let page = 1;

      const addFooter = () => {
        doc.setFontSize(10);
        doc.setTextColor("#888");
        doc.text(`Page ${page}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      };

      const addPageIfNeeded = (estimatedHeight = 0) => {
        if (y + estimatedHeight > pageHeight - margin - 30) {
          addFooter();
          doc.addPage();
          page++;
          y = margin;
        }
      };

      // Add Title
      doc.setFontSize(18);
      doc.setFont(undefined, "bold");
      doc.text(formInputs.topic, margin, y);
      y += sectionGap;

      sections.forEach((sectionTitle) => {
        const content = result[sectionTitle] || "No content available";
        const lines = doc.splitTextToSize(content, maxWidth);
        const contentHeight = lines.length * lineHeight;

        // Check and break before heading + content
        addPageIfNeeded(lineHeight + contentHeight);

        // Section Title
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.setTextColor("#2c2c2c");
        doc.text(sectionTitle, margin, y);
        y += lineHeight;

        // Section Content
        doc.setFontSize(12);
        doc.setFont(undefined, "normal");
        doc.setTextColor("#444");

        lines.forEach((line) => {
          addPageIfNeeded(lineHeight);
          doc.text(line, margin, y);
          y += lineHeight;
        });

        y += sectionGap;
      });

      addFooter();
      doc.save(
        `${formInputs.topic.replace(/[^a-z0-9]/gi, "_")}_lesson_plan.pdf`
      );
    }, 500); // slight delay to let layout/styling settle
  };

  return (
    <div className="flex gap-4 h-screen p-4 bg-muted">
      <div className="w-[40%] h-full">
        <LessonForm onGenerate={handleGenerate} />
      </div>
      <div className="w-[60%] h-full">
        <ResponsePane
          result={result}
          loadingSections={loadingSections}
          errorSections={errorSections}
          editMode={editMode}
          setEditMode={setEditMode}
          prompt={prompt}
          setPrompt={setPrompt}
          onPromptSubmit={handlePromptSubmit}
          onDownload={handleDownload}
          onRetry={retrySection}
          openSections={openSections}
          setOpenSections={setOpenSections}
        />
      </div>
    </div>
  );
}
