"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Download, Save, Layout, FileText, creditCard } from "lucide-react";
import { updateCoverLetter } from "@/actions/cover-letter";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

const MDEditor = dynamic(() => import("@uiw/react-md-editor").then((mod) => mod.default), { ssr: false });

const CoverLetterPreview = ({ id, content: initialContent, coverLetter }) => {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [template, setTemplate] = useState("modern"); // Default template

  const [headerInfo, setHeaderInfo] = useState({
    name: user?.fullName || "Maheen Sawera",
    jobTitle: coverLetter?.jobTitle || "Cyber Security Analyst",
    email: user?.primaryEmailAddress?.emailAddress || "maheen@email.com",
    phone: "+92 322 6543868",
    location: "Lahore, Pakistan",
    recipientName: "CEO Usman",
    recipientTitle: "Hiring Manager",
    linkedin: "://linkedin.com",
    twitter: "@maheen",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  });

  useEffect(() => { setContent(initialContent); }, [initialContent]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // --- STRICT CLEAN CONTENT LOGIC ---
  const cleanBody = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .filter((line) => {
        const l = line.toLowerCase().trim();
        const nameParts = headerInfo.name.toLowerCase().split(" ");
        const isNameLine = nameParts.some(part => l === part) || l === headerInfo.name.toLowerCase();
        
        return (
          l !== "" &&
          !l.startsWith("sincerely") &&
          !l.startsWith("regards") &&
          !l.startsWith("thank you") &&
          !isNameLine &&
          !l.includes("maheen") // Extra safety for your specific duplicate issue
        );
      })
      .join("\n")
      .trim();
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("cover-letter-pdf");
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 0,
        filename: `Cover-Letter.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };
      await html2pdf().set(opt).from(element).save();
      toast.success("PDF Downloaded!");
    } catch (error) { toast.error("PDF Error"); } finally { setIsGenerating(false); }
  };

  const renderTemplate = () => {
    const bodyText = cleanBody(content);

    // --- TEMPLATE 1: MODERN SIDEBAR (Sherlock) ---
    if (template === "modern") {
      return (
        <div id="cover-letter-pdf" style={{ display: "flex", width: "210mm", height: "296mm", background: "#fff", overflow: "hidden", boxSizing: "border-box", color: "#000" }}>
          <div style={{ width: "32%", background: "#3d4451", color: "#fff", padding: "30px 20px", display: "flex", flexDirection: "column", gap: "20px", fontSize: "9pt" }}>
            <div style={{ textAlign: "center" }}>
              {profileImage ? <img src={profileImage} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.2)" }} alt="Profile" /> : <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#5a6270", margin: "0 auto" }} />}
            </div>
            <section><p style={{ fontWeight: "bold", borderBottom: "1px solid #555", paddingBottom: "3px", marginBottom: "5px" }}>TO</p><p style={{margin:0}}>{headerInfo.recipientName}</p><p style={{margin:0, opacity:0.7}}>{headerInfo.recipientTitle}</p></section>
            <section><p style={{ fontWeight: "bold", borderBottom: "1px solid #555", paddingBottom: "3px", marginBottom: "5px" }}>FROM</p><p style={{margin:0}}>{headerInfo.name}</p></section>
            <section><p style={{ fontWeight: "bold", borderBottom: "1px solid #555", paddingBottom: "3px", marginBottom: "5px" }}>DATE</p><p style={{margin:0}}>{headerInfo.date}</p></section>
            <section style={{ marginTop: "auto" }}><p style={{ fontWeight: "bold", borderBottom: "1px solid #555", paddingBottom: "3px", marginBottom: "5px" }}>FOLLOW ME</p><p style={{margin:0}}>In: {headerInfo.linkedin}</p><p style={{margin:0}}>Tw: {headerInfo.twitter}</p></section>
          </div>
          <div style={{ width: "68%", padding: "40px 35px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px" }}>
              <div><h1 style={{ fontSize: "26pt", fontWeight: "900", margin: "0", color: "#000" }}>{headerInfo.name.toUpperCase()}</h1><p style={{ color: "#2563eb", fontWeight: "bold", margin:0 }}>{headerInfo.jobTitle.toUpperCase()}</p></div>
              <div style={{ textAlign: "right", fontSize: "8pt", color: "#444" }}><p style={{margin:0}}>📍 {headerInfo.location}</p><p style={{margin:0}}>📞 {headerInfo.phone}</p><p style={{margin:0}}>✉️ {headerInfo.email}</p></div>
            </div>
            <h3 style={{ fontSize: "13pt", fontWeight: "bold", borderBottom: "2px solid #f0f0f0", paddingBottom: "5px", marginBottom: "15px", color: "#000" }}>COVER LETTER</h3>
            <div style={{ fontSize: "10pt", lineHeight: "1.5", whiteSpace: "pre-wrap", textAlign: "justify", flexGrow: 1, color: "#000" }}>{bodyText}</div>
            <div style={{ marginTop: "20px" }}><p style={{ margin: "0", color: "#666" }}>Sincerely,</p><p style={{ fontSize: "20pt", fontWeight: "bold", fontStyle: "italic", margin: "5px 0", color: "#000", fontFamily: "cursive" }}>{headerInfo.name}</p></div>
          </div>
        </div>
      );
    }

    // --- TEMPLATE 2: PROFESSIONAL BLUE (Image Style) ---
    if (template === "blue") {
      return (
        <div id="cover-letter-pdf" style={{ width: "210mm", height: "296mm", background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden", color: "#000" }}>
          <div style={{ background: "#2d2e32", padding: "35px 50px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
            <div><h1 style={{ fontSize: "26pt", fontWeight: "bold", margin: "0" }}>PROFESSIONAL</h1><h1 style={{ fontSize: "26pt", fontWeight: "bold", margin: "0", color: "#4a90e2" }}>COVER LETTER</h1></div>
            <div style={{ textAlign: "right", fontSize: "9pt" }}><p style={{margin:0}}>{headerInfo.phone} 📞</p><p style={{margin:0}}>{headerInfo.email} ✉️</p><p style={{margin:0}}>{headerInfo.location} 📍</p></div>
          </div>
          <div style={{ padding: "40px 60px", flexGrow: 1 }}>
            <p style={{ marginBottom: "15px", color: "#000" }}>{headerInfo.date}</p>
            <div style={{ fontSize: "10.5pt", lineHeight: "1.6", whiteSpace: "pre-wrap", color: "#000" }}>{bodyText}</div>
            <div style={{ marginTop: "30px" }}><p style={{color:"#000", margin:0}}>Sincerely,</p><p style={{ fontSize: "18pt", fontWeight: "bold", color: "#4a90e2", margin:0 }}>{headerInfo.name}</p></div>
          </div>
        </div>
      );
    }

    // --- TEMPLATE 3: SIMPLE (Classic Style) ---
    return (
      <div id="cover-letter-pdf" style={{ width: "210mm", height: "296mm", padding: "60px 80px", background: "#fff", overflow: "hidden", color: "#000" }}>
        <h1 style={{ fontSize: "24pt", fontWeight: "bold", margin: "0" }}>{headerInfo.name}</h1>
        <p style={{ color: "#2563eb", marginBottom: "5px", fontSize: "12pt" }}>{headerInfo.jobTitle}</p>
        <div style={{ fontSize: "9pt", color: "#666", marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          {headerInfo.email} | {headerInfo.phone} | {headerInfo.location}
        </div>
        <p style={{ marginBottom: "20px" }}>{headerInfo.date}</p>
        <div style={{ fontSize: "11pt", lineHeight: "1.6", whiteSpace: "pre-wrap", textAlign: "justify", flexGrow: 1 }}>{bodyText}</div>
        <div style={{ marginTop: "40px" }}>
          <p style={{ margin: 0 }}>Sincerely,</p>
          <p style={{ fontWeight: "bold", fontSize: "14pt", marginTop: "5px" }}>{headerInfo.name}</p>
        </div>
      </div>
    );
  };

  if (!isLoaded) return <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="py-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-neutral-900 border rounded-xl text-white">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Profile & Name</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-[10px] mb-2" />
          <Input className="bg-neutral-800 h-8 text-xs text-white" value={headerInfo.name} onChange={(e) => setHeaderInfo({...headerInfo, name: e.target.value})} placeholder="Full Name" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Contact & Location</label>
          <Input className="bg-neutral-800 h-8 text-xs text-white" value={headerInfo.email} onChange={(e) => setHeaderInfo({...headerInfo, email: e.target.value})} placeholder="Email" />
          <Input className="bg-neutral-800 h-8 text-xs text-white" value={headerInfo.location} onChange={(e) => setHeaderInfo({...headerInfo, location: e.target.value})} placeholder="Location" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase">Design Selection</label>
          <div className="grid grid-cols-1 gap-1">
            <Button variant={template === "modern" ? "default" : "secondary"} size="sm" className="h-7 text-[9px]" onClick={() => setTemplate("modern")}>Modern Sidebar</Button>
            <Button variant={template === "blue" ? "default" : "secondary"} size="sm" className="h-7 text-[9px]" onClick={() => setTemplate("blue")}>Professional Blue</Button>
            <Button variant={template === "simple" ? "default" : "secondary"} size="sm" className="h-7 text-[9px]" onClick={() => setTemplate("simple")}>Simple Classic</Button>
          </div>
        </div>
        <div className="flex flex-col justify-end gap-2">
          <Button variant="outline" className="h-8 text-xs" onClick={generatePDF} disabled={isGenerating}><Download size={14} className="mr-1" /> PDF</Button>
          <Button className="h-8 text-xs" onClick={async () => { setIsSaving(true); try { await updateCoverLetter(id, content); toast.success("Saved!"); } finally { setIsSaving(false); } }} disabled={isSaving}><Save size={14} className="mr-1" /> Save</Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden" data-color-mode="light">
        <MDEditor value={content} onChange={setContent} height={500} />
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>{renderTemplate()}</div>
    </div>
  );
};

export default CoverLetterPreview;
