import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, Code, Globe, Maximize2, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function TypeformShareView() {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);
    const [embedType, setEmbedType] = useState('full');
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5173/';
    const embedSnippets = {
        full: `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0" allow="fullscreen"></iframe>`,
        popup: `<script src="http://localhost:5173/embed.js"></script>\n<button data-tf-popup="react-survey">Open Survey</button>`,
        drawer: `<script src="http://localhost:5173/embed.js"></script>\n<button data-tf-slider="react-survey">Provide Feedback</button>`,
    };
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        toast.success('Share link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 2000);
    };
    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(embedSnippets[embedType]);
        setCopiedEmbed(true);
        toast.success('Embed code snippet copied!');
        setTimeout(() => setCopiedEmbed(false), 2000);
    };
    return (<div className="max-w-5xl mx-auto w-full space-y-8 p-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-bold border border-primary/20">
          <Share2 className="h-4 w-4"/> Share & Embed Options
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
          Publish & Share Your Form Anywhere
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Distribute your conversational form via direct URL link, embed it seamlessly into your web application, or trigger it via a popup drawer.
        </p>
      </div>

      {/* Share Direct Link Card */}
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary"/> Direct Form Link
            </h3>
            <p className="text-xs text-muted-foreground">
              Send this link to respondents via email, Slack, or social media.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="text" readOnly value={shareUrl} className="w-full sm:w-80 rounded-xl border border-border bg-background px-4 py-2 text-xs font-mono font-bold text-foreground focus:outline-none"/>
            <Button onClick={handleCopyLink} className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-4 gap-1.5 shrink-0">
              {copiedLink ? <Check className="h-3.5 w-3.5"/> : <Copy className="h-3.5 w-3.5"/>}
              {copiedLink ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Embed on Web Options */}
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Code className="h-4 w-4 text-primary"/> Embed on Your Website
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose an embed style and copy the HTML snippet into your Next.js, React, or HTML site.
          </p>
        </div>

        {/* Embed Type Switcher Pills */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
          {[
            { id: 'full', label: 'Full Page Iframe', icon: Maximize2 },
            { id: 'popup', label: 'Popup Modal', icon: Globe },
            { id: 'drawer', label: 'Slider Drawer', icon: SlidersHorizontal },
        ].map((type) => {
            const Icon = type.icon;
            const isSelected = embedType === type.id;
            return (<button key={type.id} onClick={() => setEmbedType(type.id)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-3.5 w-3.5"/>
                {type.label}
              </button>);
        })}
        </div>

        {/* Snippet Code Box */}
        <div className="relative rounded-2xl border border-border bg-slate-950 p-4 font-mono text-xs text-emerald-400">
          <pre className="overflow-x-auto whitespace-pre-wrap">{embedSnippets[embedType]}</pre>

          <button onClick={handleCopyEmbed} className="absolute top-3 right-3 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            {copiedEmbed ? <Check className="h-3 w-3 text-emerald-400"/> : <Copy className="h-3 w-3"/>}
            {copiedEmbed ? 'Copied Code!' : 'Copy Code'}
          </button>
        </div>
      </Card>
    </div>);
}
