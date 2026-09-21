import { useState } from "react";
import { X, FileText, LayoutTemplate, Check } from "lucide-react";
import { createBlankForm, saveFormToStorage } from "@/lib/formStore";
import { ALL_FORM_DESIGNS } from "@/designs";
import { createFormInBackend } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
export function CreateFormModal({ isOpen, onClose, onFormCreated, }) {
    const [formName, setFormName] = useState("");
    const [mode, setMode] = useState("scratch");
    const [selectedTemplateId, setSelectedTemplateId] = useState(ALL_FORM_DESIGNS[0].form.id);
    if (!isOpen)
        return null;
    const handleCreate = async () => {
        const name = formName.trim();
        let newForm;
        if (mode === "template") {
            const templatePreset = ALL_FORM_DESIGNS.find((d) => d.form.id === selectedTemplateId) ||
                ALL_FORM_DESIGNS[0];
            const templateForm = templatePreset.form;
            const uniqueId = `form-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            newForm = {
                ...templateForm,
                id: uniqueId,
                title: name || templatePreset.meta.name,
                status: "draft",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                welcomeScreen: templateForm.welcomeScreen
                    ? {
                        ...templateForm.welcomeScreen,
                        title: name
                            ? `Welcome to ${name}`
                            : templateForm.welcomeScreen.title,
                    }
                    : undefined,
                nodes: JSON.parse(JSON.stringify(templateForm.nodes)),
            };
            // Relink formId on nodes
            Object.values(newForm.nodes).forEach((n) => {
                n.formId = uniqueId;
            });
        }
        else {
            newForm = createBlankForm(name || "Untitled form");
        }
        // Send form creation to backend if online
        try {
            const backendForm = await createFormInBackend(newForm.title);
            if (backendForm) {
                newForm.id = backendForm.id;
            }
        }
        catch (err) {
            console.warn('Backend unavailable, using local form:', err);
        }
        saveFormToStorage(newForm);
        setFormName("");
        onFormCreated(newForm);
        onClose();
    };
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-in overflow-hidden rounded-xl border border-border bg-card shadow-2xl duration-200 zoom-in-95 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Create a new form
          </h2>
          <button onClick={onClose} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            <X className="h-4 w-4"/>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-5 py-5">
          {/* Form name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Form name
            </label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={mode === "template"
            ? "Optional custom title..."
            : "Untitled form"} autoFocus className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none" onKeyDown={(e) => e.key === "Enter" && handleCreate()}/>
          </div>

          {/* Mode selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Start from
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode("scratch")} className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-medium transition-all ${mode === "scratch"
            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                <FileText className="h-4 w-4 shrink-0 text-primary"/>
                <span>Blank Canvas</span>
              </button>
              <button type="button" onClick={() => setMode("template")} className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-3 text-sm font-medium transition-all ${mode === "template"
            ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/30"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                <LayoutTemplate className="h-4 w-4 shrink-0 text-primary"/>
                <span>Preset Design</span>
              </button>
            </div>
          </div>

          {/* Template Selection Cards */}
          {mode === "template" && (<div className="animate-in space-y-2.5 duration-200 fade-in slide-in-from-top-2">
              <label className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Select Design Template
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {ALL_FORM_DESIGNS.map((preset) => {
                const isSelected = selectedTemplateId === preset.form.id;
                return (<div key={preset.form.id} onClick={() => setSelectedTemplateId(preset.form.id)} className={`flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3.5 transition-all ${isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border bg-card/50 hover:border-border/80 hover:bg-accent/40"}`}>
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {preset.meta.shortName}
                          </span>
                          <Badge variant="outline" className={`px-1.5 py-0 text-[10px] ${preset.meta.theme.badgeColor}`}>
                            {preset.meta.badge}
                          </Badge>
                        </div>
                        <p className="line-clamp-2 text-xs text-muted-foreground">
                          {preset.meta.description}
                        </p>
                      </div>
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"}`}>
                        {isSelected && <Check className="h-2.5 w-2.5"/>}
                      </div>
                    </div>);
            })}
              </div>
            </div>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/30 px-5 py-4">
          <button onClick={onClose} className="h-9 rounded-lg px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
            Cancel
          </button>
          <button onClick={handleCreate} className="h-9 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            {mode === "template" ? "Use Template" : "Create form"}
          </button>
        </div>
      </div>
    </div>);
}
