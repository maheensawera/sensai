"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Edit, Save, Loader2, Download } from "lucide-react";
import { updateCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

const CoverLetterPreview = ({ id, content: initialContent, coverLetter }) => {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const generatePDF = async () => {
    if (!id) return toast.error("Cover Letter ID is missing!");
    setIsGenerating(true);

    try {
      const element = document.getElementById("cover-letter-pdf");
      if (!element) throw new Error("PDF template not found");

      const style = document.createElement("style");
      style.innerHTML = `
        @page { size: A4; margin: 0; }
        #cover-letter-pdf, #cover-letter-pdf * {
          color: #000000 !important;
          background-color: transparent !important;
          border-color: #000000 !important;
          box-sizing: border-box;
        }
      `;
      document.head.appendChild(style);

      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: `${coverLetter?.companyName || "Cover-Letter"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff", scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().set(opt).from(element).save();
      document.head.removeChild(style);
      toast.success("PDF Downloaded!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await updateCoverLetter(id, content);
      toast.success("Updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

 // CLEANUP LOGIC: Yeh function editor ke text se purani info nikal dega
  const cleanContent = (content || "")
    .split("\n")
    .filter((line) => {
      const l = line.toLowerCase().trim();
      const userName = user?.fullName?.toLowerCase() || "maheen sawera";
      
      return (
        l !== userName &&
        l !== "sincerely," &&
        l !== "sincerely" &&
        l !== "thank you," &&
        l !== "thank you" &&
        !l.includes("maheensawera1040") &&
        !l.includes("satrah") &&
        !l.includes("sialkot") &&
        !l.includes("+92") &&
        !l.includes("phone") &&
        !l.includes("cyber security") && // Header title duplication se bachne ke liye
        !l.startsWith("subject:") &&
        !l.includes("re: application")
      );
    })
    .join("\n")
    .trim();

  if (!isLoaded) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="py-4 space-y-4">
      <div className="flex justify-end gap-2 bg-muted/50 p-3 rounded-lg border">
        <Button variant="outline" onClick={generatePDF} disabled={isGenerating || isEditing}>
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
          Download PDF
        </Button>
        <Button variant="secondary" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : isEditing ? "Save Changes" : "Edit Letter"}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden" data-color-mode="dark">
        <MDEditor value={content} onChange={setContent} height={600} preview={isEditing ? "edit" : "preview"} hideToolbar={!isEditing} />
      </div>

      {/* --- FINAL ONE-PAGE A4 TEMPLATE --- */}
      <div className="hidden">
        <div id="cover-letter-pdf" style={{
          background: "#ffffff",
          width: "210mm",
          minHeight: "296.5mm", // Slightly under A4 to prevent blank page
          padding: "50px 70px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden",
          position: "relative"
        }}>
          {/* Header */}
          <div style={{ marginBottom: "25px" }}>
            <h1 style={{ fontSize: "32pt", fontWeight: "bold", margin: "0 0 4px 0", color: "#000", letterSpacing: "-1px" }}>
              {user?.fullName || "Maheen Sawera"}
            </h1>
            <p style={{ fontSize: "14pt", color: "#2563eb", fontWeight: "500", margin: "0 0 15px 0" }}>
              {coverLetter?.jobTitle || "Cyber Security Analyst"}
            </p>
            <div style={{ display: "flex", gap: "12px", fontSize: "8.5pt", color: "#555", borderTop: "1px solid #eee", paddingTop: "12px" }}>
               <span>{user?.primaryEmailAddress?.emailAddress}</span>
               <span>•</span>
               <span>{user?.unsafeMetadata?.phone || "+92 32265438"}</span>
               <span>•</span>
               <span>Satrah, Sialkot</span>
            </div>
          </div>

          <div style={{ fontSize: "8pt", fontWeight: "bold", color: "#aaa", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "15px" }}>
            Cover Letter
          </div>

          {/* Body */}
          <div style={{ fontSize: "10.5pt", lineHeight: "1.6", color: "#000", textAlign: "justify", flexGrow: 1 }}>
            <div dangerouslySetInnerHTML={{ __html: cleanContent.replace(/\n/g, "<br/>") }} />
          </div>

        {/* Signature - Sirf yahan professional signature hona chahiye */}
          <div style={{ marginTop: "20px", borderTop: "1px solid #fafafa", paddingTop: "10px" }}>
            <p style={{ color: "#666", margin: "0", fontSize: "10pt" }}>Sincerely,</p>
            <p style={{ fontSize: "16pt", fontWeight: "bold", fontStyle: "italic", margin: "5px 0 0 0", color: "#000" }}>
              {user?.fullName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPreview;