"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Layout, ArrowLeft, Edit3, Printer, X, Pencil, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { resumeSchema } from "@/app/lib/schema";

const TEMPLATES = [
  { id: "modern-sidebar", name: "Modern Sidebar", accent: "#1a3c5e", hasImage: true },
  { id: "teal-pro", name: "Teal Professional", accent: "#2a9d8f", hasImage: true },
  { id: "classic-bold", name: "Classic Bold", accent: "#2c3e50", hasImage: false },
  { id: "navy-exec", name: "Navy Executive", accent: "#1e3a5f", hasImage: false },
  { id: "fresher", name: "Fresher Creative", accent: "#3a86ff", hasImage: true },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
const escapeHtml = (str) => str ? str.replace(/[&<>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m])) : '';

const getSocialDisplay = (url, type) => {
  if (!url) return type === 'linkedin' ? 'LinkedIn' : 'Twitter';
  const patterns = {
    linkedin: /linkedin\.com\/in\/([^\/?#]+)/,
    twitter: /(twitter|x)\.com\/([^\/?#]+)/
  };
  const match = url.match(patterns[type]);
  return match ? (type === 'linkedin' ? `linkedin.com/in/${match[1]}` : `@${match[2]}`) : (type === 'linkedin' ? 'LinkedIn' : 'Twitter');
};

const getAvatarHTML = (image, name) => {
  if (image?.startsWith('data:image')) {
    return `<img src="${image}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Profile" />`;
  }
  return `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:34px;font-weight:700;">${escapeHtml(name?.charAt(0).toUpperCase() || 'U')}</div>`;
};

const renderEntries = (arr, accent) => arr?.length ? arr.map(e => `
  <div style="margin-bottom:16px;">
    <div style="font-size:14px;font-weight:700;color:#111;">${escapeHtml(e.title)}</div>
    <div style="font-size:13px;color:${accent};margin-bottom:2px;">${escapeHtml(e.organization)}</div>
    <div style="font-size:12px;color:#888;margin-bottom:5px;">${escapeHtml(e.startDate)} – ${e.current ? "Present" : escapeHtml(e.endDate)}</div>
    <div style="font-size:13px;color:#444;line-height:1.65;">${escapeHtml(e.description)}</div>
  </div>
`).join("") : `<div style="font-size:13px;color:#bbb;">—</div>`;

const section = (label, accent) => `
  <div style="font-size:11px;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:1.2px;border-bottom:2px solid ${accent};padding-bottom:4px;margin:22px 0 12px;">${label}</div>
`;

// ─── CSS Templates (reusable) ─────────────────────────────────────────────────
const baseCSS = `
  @media print { @page { margin: 0; size: A4; } body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
  * { margin: 0; padding: 0; box-sizing: border-box; }
`;

const templateStyles = {
  "modern-sidebar": `
    body { font-family: Arial, sans-serif; display: flex; background: #fff; }
    .sb { background: #1a3c5e; color: #fff; width: 265px; padding: 32px 20px; }
    .av { width: 88px; height: 88px; border-radius: 50%; background: #4a90a4; margin: 0 auto 14px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    .sb-name { text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 4px; }
    .sb-sec { color: #7ec8e3; font-size: 10px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,.2); padding-bottom: 3px; margin: 16px 0 8px; }
    .sb-item { font-size: 12px; color: rgba(255,255,255,.85); margin-bottom: 5px; word-break: break-all; }
    .main { flex: 1; padding: 32px 26px; background: #fff; }
  `,
  "teal-pro": `
    body { font-family: 'Segoe UI', Arial, sans-serif; }
    .hdr { background: #2a9d8f; padding: 22px 28px; display: flex; align-items: center; gap: 18px; color: #fff; flex-wrap: wrap; }
    .av { width: 70px; height: 70px; border-radius: 50%; background: rgba(255,255,255,.25); overflow: hidden; display: flex; align-items: center; justify-content: center; border: 3px solid rgba(255,255,255,.5); }
    .h-name { font-size: 20px; font-weight: 700; }
    .h-c { margin-left: auto; text-align: right; font-size: 12px; line-height: 1.9; }
    .body { display: flex; flex-wrap: wrap; }
    .sb { width: 248px; background: #f4f9f8; padding: 22px 16px; border-right: 1px solid #d0ece8; }
    .main { flex: 1; padding: 22px 24px; }
    .st { font-size: 11px; font-weight: 700; color: #2a9d8f; text-transform: uppercase; border-bottom: 2px solid #2a9d8f; padding-bottom: 3px; margin: 18px 0 10px; }
    .tag { display: inline-block; background: #e0f2f0; color: #2a9d8f; border-radius: 12px; padding: 3px 10px; font-size: 11px; margin: 2px; }
  `,
  "classic-bold": `
    body { font-family: 'Times New Roman', serif; padding: 42px; max-width: 820px; margin: 0 auto; }
    .tb { height: 8px; background: #2c3e50; margin-bottom: 22px; }
    h1 { font-size: 26px; color: #2c3e50; text-transform: uppercase; }
    .cline { font-size: 12px; color: #555; border-top: 1px solid #bdc3c7; border-bottom: 1px solid #bdc3c7; padding: 5px 0; margin: 8px 0 18px; }
    .st { font-size: 12px; font-weight: 700; color: #2c3e50; text-transform: uppercase; border-bottom: 2px solid #2c3e50; padding-bottom: 3px; margin: 18px 0 10px; }
    .row { display: flex; justify-content: space-between; flex-wrap: wrap; }
    .role { font-size: 13px; font-weight: 700; color: #2c3e50; }
    .date { font-size: 11px; color: #7f8c8d; }
    .org { font-size: 12px; color: #555; font-style: italic; margin-bottom: 3px; }
    .desc { font-size: 12px; color: #444; line-height: 1.65; }
    .sbox { display: inline-block; border: 1px solid #2c3e50; color: #2c3e50; padding: 4px 12px; font-size: 12px; margin: 2px; }
  `,
  "navy-exec": `
    body { font-family: Calibri, Arial, sans-serif; }
    .hdr { background: #1e3a5f; color: #fff; padding: 24px 28px; display: flex; justify-content: space-between; flex-wrap: wrap; }
    .h-name { font-size: 22px; font-weight: 700; }
    .h-r { text-align: right; font-size: 12px; line-height: 1.9; }
    .body { display: flex; flex-wrap: wrap; }
    .lc { width: 40%; background: #f0f4f8; padding: 22px 18px; border-right: 1px solid #d0dae4; }
    .rc { flex: 1; padding: 22px 24px; }
    .st { font-size: 11px; font-weight: 700; color: #1e3a5f; text-transform: uppercase; border-bottom: 2px solid #1e3a5f; padding-bottom: 3px; margin: 18px 0 10px; }
    .ex { font-size: 12px; color: #333; padding: 4px 0; border-bottom: 1px dotted #ccc; }
  `,
  "fresher": `
    body { font-family: Arial, sans-serif; display: flex; flex-wrap: wrap; }
    .sb { background: #1d3557; color: #fff; width: 232px; padding: 28px 16px; }
    .av { width: 80px; height: 80px; border-radius: 50%; background: #3a86ff; margin: 0 auto 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; }
    .sb-name { text-align: center; font-size: 15px; font-weight: 700; }
    .sb-sec { color: #90e0ef; font-size: 9px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,.2); padding-bottom: 3px; margin: 14px 0 6px; }
    .sb-item { font-size: 11px; color: rgba(255,255,255,.85); margin-bottom: 4px; }
    .main { flex: 1; }
    .mhdr { background: #3a86ff; padding: 18px 22px; }
    .mhdr-n { color: #fff; font-size: 20px; font-weight: 700; }
    .mbody { padding: 18px 22px; }
    .mst { font-size: 11px; font-weight: 700; color: #3a86ff; text-transform: uppercase; border-bottom: 2px solid #3a86ff; padding-bottom: 3px; margin: 16px 0 10px; }
    .stag { display: inline-block; background: #e8f0fe; color: #1d3557; border-radius: 3px; padding: 3px 8px; font-size: 11px; margin: 2px; border-left: 3px solid #3a86ff; }
  `
};

// ─── Template Builders ────────────────────────────────────────────────────────
const buildHTML = (tid, data) => {
  const { name, email, mobile, linkedin, twitter, summary, skills, profileImage, experience, education, projects } = data;
  const skillList = (skills || "").split(/[,\n]/).map(s => s.trim()).filter(Boolean);
  const accent = TEMPLATES.find(t => t.id === tid)?.accent || "#3a86ff";

  const socialLinks = `
    <div class="sb-item">📧 ${escapeHtml(email)}</div>
    <div class="sb-item">📱 ${escapeHtml(mobile)}</div>
    <div class="sb-item">💼 ${linkedin ? `<a href="${escapeHtml(linkedin)}" target="_blank">${getSocialDisplay(linkedin, 'linkedin')}</a>` : "LinkedIn"}</div>
    <div class="sb-item">🐦 ${twitter ? `<a href="${escapeHtml(twitter)}" target="_blank">${getSocialDisplay(twitter, 'twitter')}</a>` : "Twitter"}</div>
  `;

  const skillsHTML = tid === "classic-bold" 
    ? `<div>${skillList.map(s => `<span class="sbox">${escapeHtml(s)}</span>`).join("")}</div>`
    : `<div>${skillList.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join("")}</div>`;

  const mainContent = `
    ${section("Profile", accent)}<div class="desc">${escapeHtml(summary)}</div>
    ${section("Work Experience", accent)}${renderEntries(experience, accent)}
    ${section("Education", accent)}${renderEntries(education, accent)}
    ${projects?.length ? section("Projects", accent) + renderEntries(projects, accent) : ""}
  `;

  const style = templateStyles[tid] || templateStyles.fresher;

  // Template-specific layouts
  if (tid === "modern-sidebar") return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseCSS}${style}</style></head><body>
    <div class="sb"><div class="av">${getAvatarHTML(profileImage, name)}</div><div class="sb-name">${escapeHtml(name)}</div><div class="sb-sec">Contact</div>${socialLinks}<div class="sb-sec">Skills</div>${skillList.map(s => `<div class="sb-item">▸ ${escapeHtml(s)}</div>`).join("")}</div>
    <div class="main">${mainContent}</div>
  </body></html>`;

  if (tid === "teal-pro") return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseCSS}${style}</style></head><body>
    <div class="hdr"><div class="av">${getAvatarHTML(profileImage, name)}</div><div><div class="h-name">${escapeHtml(name)}</div></div><div class="h-c">${socialLinks.replace(/sb-item/g, '')}</div></div>
    <div class="body"><div class="sb"><div class="st">Profile Summary</div><div class="desc">${escapeHtml(summary)}</div><div class="st">Skills</div>${skillsHTML}</div>
    <div class="main">${section("Professional Experience", accent)}${renderEntries(experience, accent)}${section("Education", accent)}${renderEntries(education, accent)}</div></div>
  </body></html>`;

  if (tid === "classic-bold") return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseCSS}${style}</style></head><body>
    <div class="tb"></div><h1>${escapeHtml(name)}</h1><div class="cline">${escapeHtml(email)} | ${escapeHtml(mobile)} | ${getSocialDisplay(linkedin, 'linkedin')} | ${getSocialDisplay(twitter, 'twitter')}</div>
    ${section("Professional Summary", accent)}<div class="desc">${escapeHtml(summary)}</div>${section("Work Experience", accent)}${renderEntries(experience, accent)}${section("Education", accent)}${renderEntries(education, accent)}${section("Skills", accent)}${skillsHTML}
  </body></html>`;

  if (tid === "navy-exec") return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseCSS}${style}</style></head><body>
    <div class="hdr"><div><div class="h-name">${escapeHtml(name).toUpperCase()}</div></div><div class="h-r">${escapeHtml(email)}<br/>${escapeHtml(mobile)}<br/>${getSocialDisplay(linkedin, 'linkedin')} | ${getSocialDisplay(twitter, 'twitter')}</div></div>
    <div class="body"><div class="lc"><div class="st">Professional Summary</div><div class="txt">${escapeHtml(summary)}</div><div class="st">Areas of Expertise</div>${skillList.map(s => `<div class="ex">▸ ${escapeHtml(s)}</div>`).join("")}</div>
    <div class="rc"><div class="st">Experience Highlights</div>${renderEntries(experience, accent)}<div class="st">Education</div>${renderEntries(education, accent)}</div></div>
  </body></html>`;

  // Fresher Creative (default)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${baseCSS}${style}</style></head><body>
    <div class="sb"><div class="av">${getAvatarHTML(profileImage, name)}</div><div class="sb-name">${escapeHtml(name)}</div><div class="sb-sec">Contact</div>${socialLinks}<div class="sb-sec">Skills</div>${skillList.map(s => `<div class="sb-item">▸ ${escapeHtml(s)}</div>`).join("")}</div>
    <div class="main"><div class="mhdr"><div class="mhdr-n">${escapeHtml(name)}</div></div><div class="mbody">
      <div class="mst">Career Objective</div><div class="desc">${escapeHtml(summary)}</div>
      <div class="mst">Technical Skills</div>${skillsHTML}
      <div class="mst">Education</div>${renderEntries(education, accent)}
      ${experience?.length ? `<div class="mst">Experience</div>${renderEntries(experience, accent)}` : ""}
      ${projects?.length ? `<div class="mst">Projects</div>${renderEntries(projects, accent)}` : ""}
    </div></div>
  </body></html>`;
};

// ─── Reusable Components ──────────────────────────────────────────────────────
const ProfileImageUpload = ({ image, onImageChange }) => {
  const [preview, setPreview] = useState(image || "");
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPreview(reader.result); onImageChange(reader.result); };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
            <button onClick={() => { setPreview(""); onImageChange(""); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 className="h-3 w-3" /></button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed"><Upload className="h-8 w-8 text-muted-foreground" /></div>
        )}
      </div>
      <div>
        <Button variant="outline" onClick={() => document.getElementById("profileInput").click()}><Upload className="h-4 w-4 mr-2" />{preview ? "Change" : "Upload"} Photo</Button>
        <input id="profileInput" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>
    </div>
  );
};

const InlineEditPanel = ({ data, onUpdate, onClose }) => {
  const [editData, setEditData] = useState(data);
  const sections = ['experience', 'education', 'projects'];
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold">Edit Resume</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-5 w-5" /></Button>
        </div>
        <div className="p-6 space-y-6">
          <ProfileImageUpload image={editData.profileImage} onImageChange={(img) => setEditData({...editData, profileImage: img})} />
          
          <div className="grid grid-cols-2 gap-4">
            {['name', 'email', 'mobile', 'linkedin', 'twitter'].map(field => (
              <div key={field}>
                <label className="text-sm font-medium block mb-1 capitalize">{field}</label>
                <Input value={editData[field] || ''} onChange={e => setEditData({...editData, [field]: e.target.value})} placeholder={field} />
              </div>
            ))}
          </div>
          
          <div><label className="text-sm font-medium block mb-1">Summary</label><Textarea value={editData.summary} onChange={e => setEditData({...editData, summary: e.target.value})} className="h-28" /></div>
          <div><label className="text-sm font-medium block mb-1">Skills (comma separated)</label><Textarea value={editData.skills} onChange={e => setEditData({...editData, skills: e.target.value})} className="h-20" /></div>
          
          {sections.map(section => (
            <div key={section}>
              <h4 className="font-semibold mb-3 text-lg capitalize">{section}</h4>
              {editData[section]?.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-3 space-y-2 mb-3">
                  <Input placeholder="Title" value={item.title || ''} onChange={e => { const newItems = [...editData[section]]; newItems[idx].title = e.target.value; setEditData({...editData, [section]: newItems}); }} />
                  <Input placeholder="Organization" value={item.organization || ''} onChange={e => { const newItems = [...editData[section]]; newItems[idx].organization = e.target.value; setEditData({...editData, [section]: newItems}); }} />
                  <div className="flex gap-2"><Input placeholder="Start Date" value={item.startDate || ''} onChange={e => { const newItems = [...editData[section]]; newItems[idx].startDate = e.target.value; setEditData({...editData, [section]: newItems}); }} />
                  <Input placeholder="End Date" value={item.current ? "Present" : (item.endDate || '')} disabled={item.current} onChange={e => { const newItems = [...editData[section]]; newItems[idx].endDate = e.target.value; setEditData({...editData, [section]: newItems}); }} /></div>
                  <Textarea placeholder="Description" value={item.description || ''} onChange={e => { const newItems = [...editData[section]]; newItems[idx].description = e.target.value; setEditData({...editData, [section]: newItems}); }} className="h-20" />
                  <Button variant="destructive" size="sm" onClick={() => setEditData({...editData, [section]: editData[section].filter((_, i) => i !== idx)})}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" onClick={() => setEditData({...editData, [section]: [...(editData[section] || []), { title: "", organization: "", startDate: "", endDate: "", description: "", current: false }]})}>+ Add {section.slice(0, -1)}</Button>
            </div>
          ))}
        </div>
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onUpdate(editData); onClose(); }}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

const MiniPreview = ({ tid, accent }) => (
  <div style={{ fontFamily: "Arial", height: 130, overflow: "hidden", background: "#fff" }}>
    <div style={{ background: accent, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10 }}>{TEMPLATES.find(t => t.id === tid)?.name}</div>
    <div style={{ padding: 8 }}><div style={{ background: "#ddd", height: 2, marginBottom: 4 }} /><div style={{ background: "#eee", height: 2 }} /></div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResumeBuilder({ initialContent }) {
  const { user } = useUser();
  const [mode, setMode] = useState("form");
  const [htmlContent, setHtml] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hovering, setHovering] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [currentData, setCurrentData] = useState({ name: "", email: "", mobile: "", linkedin: "", twitter: "", summary: "", skills: "", profileImage: "", experience: [], education: [], projects: [] });
  
  const { loading: isSaving, fn: saveResumeFn, data: saveResult, error: saveError } = useFetch(saveResume);
  const { control, register, setValue, getValues, watch } = useForm({ resolver: zodResolver(resumeSchema), defaultValues: { contactInfo: {}, summary: "", skills: "", experience: [], education: [], projects: [] } });
  const formValues = watch();

  useEffect(() => {
    if (saveResult && !isSaving) toast.success("Resume saved!");
    if (saveError) toast.error(saveError.message);
  }, [saveResult, saveError, isSaving]);

  useEffect(() => {
    if (mode === "preview" && selectedTemplate) {
      const data = {
        name: currentData.name || user?.fullName || "",
        email: formValues.contactInfo?.email || currentData.email || "",
        mobile: formValues.contactInfo?.mobile || currentData.mobile || "",
        linkedin: formValues.contactInfo?.linkedin || currentData.linkedin || "",
        twitter: formValues.contactInfo?.twitter || currentData.twitter || "",
        summary: formValues.summary || currentData.summary || "",
        skills: formValues.skills || currentData.skills || "",
        profileImage: currentData.profileImage || profileImage || "",
        experience: formValues.experience?.length ? formValues.experience : currentData.experience || [],
        education: formValues.education?.length ? formValues.education : currentData.education || [],
        projects: formValues.projects?.length ? formValues.projects : currentData.projects || [],
      };
      setHtml(buildHTML(selectedTemplate, data));
    }
  }, [mode, selectedTemplate, formValues, user, currentData, profileImage]);

  const applyTemplate = (tid) => {
    const data = {
      name: currentData.name || user?.fullName || "",
      email: getValues("contactInfo.email") || currentData.email || "",
      mobile: getValues("contactInfo.mobile") || currentData.mobile || "",
      linkedin: getValues("contactInfo.linkedin") || currentData.linkedin || "",
      twitter: getValues("contactInfo.twitter") || currentData.twitter || "",
      summary: getValues("summary") || currentData.summary || "",
      skills: getValues("skills") || currentData.skills || "",
      profileImage: currentData.profileImage || profileImage || "",
      experience: getValues("experience")?.length ? getValues("experience") : currentData.experience || [],
      education: getValues("education")?.length ? getValues("education") : currentData.education || [],
      projects: getValues("projects")?.length ? getValues("projects") : currentData.projects || [],
    };
    setCurrentData(data);
    setSelectedTemplate(tid);
    setHtml(buildHTML(tid, data));
    setMode("preview");
  };

  const handleUpdate = (updatedData) => {
    Object.keys(updatedData).forEach(key => {
      if (['email', 'mobile', 'linkedin', 'twitter'].includes(key)) setValue(`contactInfo.${key}`, updatedData[key]);
      else if (!['profileImage'].includes(key)) setValue(key, updatedData[key]);
    });
    setCurrentData(updatedData);
    setProfileImage(updatedData.profileImage || "");
    if (selectedTemplate) setHtml(buildHTML(selectedTemplate, updatedData));
    toast.success("Updated!");
  };

  const downloadPDF = () => {
    if (!htmlContent) return toast.error("No content");
    const win = window.open("", "_blank");
    if (!win) return toast.error("Allow popups");
    win.document.write(htmlContent);
    win.document.close();
    win.onload = () => setTimeout(() => { win.focus(); win.print(); }, 500);
  };

  const onSave = async () => await saveResumeFn(htmlContent || initialContent || "");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          {mode !== "form" && <Button variant="ghost" size="icon" onClick={() => { setMode("form"); setSelectedTemplate(null); }}><ArrowLeft className="h-4 w-4" /></Button>}
          <h1 className="font-bold gradient-title text-4xl md:text-5xl">Resume Builder</h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          {mode === "form" && <Button variant="outline" onClick={() => setMode("template-pick")}><Layout className="h-4 w-4 mr-2" />Choose Template</Button>}
          {mode === "preview" && <>
            <Button variant="outline" onClick={() => setMode("template-pick")}><Layout className="h-4 w-4 mr-2" />Change Template</Button>
            <Button variant="outline" onClick={() => setShowEditor(true)}><Pencil className="h-4 w-4 mr-2" />Edit Data</Button>
            <Button variant="outline" onClick={() => setMode("form")}><Edit3 className="h-4 w-4 mr-2" />Full Form</Button>
          </>}
          <Button variant="destructive" onClick={onSave} disabled={isSaving}>{isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/>Saving...</> : <><Save className="h-4 w-4 mr-2"/>Save</>}</Button>
          {mode === "preview" && <Button onClick={downloadPDF}><Printer className="h-4 w-4 mr-2" />Print PDF</Button>}
        </div>
      </div>

      {mode === "form" && (
        <div className="space-y-6">
          <div className="p-4 border rounded-xl bg-blue-500/10 text-sm">💡 Fill details, then <strong>Choose Template</strong>!</div>
          <div className="space-y-2"><h3 className="text-lg font-semibold">Profile Picture</h3><div className="p-4 border rounded-lg"><ProfileImageUpload image={profileImage} onImageChange={setProfileImage} /></div></div>
          <div className="space-y-2"><h3 className="text-lg font-semibold">Contact Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div><label className="text-sm font-medium">Full Name</label><Input value={currentData.name} onChange={e => setCurrentData({...currentData, name: e.target.value})} placeholder="Your Name" /></div>
            <div><label className="text-sm font-medium">Email</label><Input {...register("contactInfo.email")} placeholder="email@example.com" /></div>
            <div><label className="text-sm font-medium">Mobile</label><Input {...register("contactInfo.mobile")} placeholder="+92 300 0000000" /></div>
            <div><label className="text-sm font-medium">LinkedIn</label><Input {...register("contactInfo.linkedin")} placeholder="https://linkedin.com/in/username" /></div>
            <div><label className="text-sm font-medium">Twitter/X</label><Input {...register("contactInfo.twitter")} placeholder="https://twitter.com/username" /></div>
          </div></div>
          <div><h3 className="text-lg font-semibold">Professional Summary</h3><Controller name="summary" control={control} render={({field}) => <Textarea {...field} className="h-28" />} /></div>
          <div><h3 className="text-lg font-semibold">Skills</h3><Controller name="skills" control={control} render={({field}) => <Textarea {...field} className="h-20" placeholder="Python, React, SQL..." />} /></div>
          {['experience', 'education', 'projects'].map(section => <div key={section}><h3 className="text-lg font-semibold capitalize">{section}</h3><Controller name={section} control={control} render={({field}) => <EntryForm type={section} entries={field.value} onChange={field.onChange} />} /></div>)}
          <Button size="lg" className="w-full" onClick={() => { setCurrentData({...currentData, name: currentData.name || user?.fullName || "", email: getValues("contactInfo.email") || "", mobile: getValues("contactInfo.mobile") || "", linkedin: getValues("contactInfo.linkedin") || "", twitter: getValues("contactInfo.twitter") || "", summary: getValues("summary") || "", skills: getValues("skills") || "", profileImage, experience: getValues("experience") || [], education: getValues("education") || [], projects: getValues("projects") || [] }); setMode("template-pick"); }}><Layout className="h-5 w-5 mr-2"/>Choose Template →</Button>
        </div>
      )}

      {mode === "template-pick" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TEMPLATES.map(t => (
            <div key={t.id} onClick={() => applyTemplate(t.id)} onMouseEnter={() => setHovering(t.id)} onMouseLeave={() => setHovering(null)} className="cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200" style={{ borderColor: hovering === t.id ? t.accent : "#e5e7eb", transform: hovering === t.id ? "translateY(-4px)" : "none" }}>
              <MiniPreview tid={t.id} accent={t.accent} />
              <div className="p-2 border-t"><p className="font-semibold text-xs" style={{ color: t.accent }}>{t.name}</p></div>
            </div>
          ))}
        </div>
      )}

      {mode === "preview" && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-green-500/10 text-sm"><Printer className="h-4 w-4 inline mr-2" />Click <strong>Print PDF</strong> → Select "Save as PDF"</div>
          <div className="border-2 rounded-xl overflow-hidden" style={{ height: 860 }}><iframe srcDoc={htmlContent} style={{ width: "100%", height: "100%", border: "none", background: "white" }} title="Preview" /></div>
        </div>
      )}

      {showEditor && <InlineEditPanel data={{ name: currentData.name || user?.fullName || "", email: currentData.email || formValues.contactInfo?.email || "", mobile: currentData.mobile || formValues.contactInfo?.mobile || "", linkedin: currentData.linkedin || formValues.contactInfo?.linkedin || "", twitter: currentData.twitter || formValues.contactInfo?.twitter || "", summary: currentData.summary || formValues.summary || "", skills: currentData.skills || formValues.skills || "", profileImage: currentData.profileImage || profileImage || "", experience: currentData.experience?.length ? currentData.experience : formValues.experience || [], education: currentData.education?.length ? currentData.education : formValues.education || [], projects: currentData.projects?.length ? currentData.projects : formValues.projects || [] }} onUpdate={handleUpdate} onClose={() => setShowEditor(false)} />}
    </div>
  );
}