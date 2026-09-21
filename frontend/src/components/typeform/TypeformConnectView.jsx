import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, CheckCircle2, Share2, Database, MessageSquare, Zap, Mail, Webhook } from 'lucide-react';
export function TypeformConnectView() {
    const [connectedApps, setConnectedApps] = useState({
        sheets: true,
        slack: true,
    });
    const integrations = [
        {
            id: 'sheets',
            name: 'Google Sheets',
            desc: 'Send submissions automatically to a live spreadsheet in real-time',
            icon: Database,
            color: 'text-emerald-500 bg-emerald-500/10',
        },
        {
            id: 'slack',
            name: 'Slack',
            desc: 'Get instant notifications in team channels for new form responses',
            icon: MessageSquare,
            color: 'text-accent-branch bg-accent-branch/10',
        },
        {
            id: 'zapier',
            name: 'Zapier',
            desc: 'Trigger 5,000+ automated workflows when a respondent completes your form',
            icon: Zap,
            color: 'text-accent-route bg-accent-route/10',
        },
        {
            id: 'hubspot',
            name: 'HubSpot CRM',
            desc: 'Sync form responses directly to candidate and lead CRM records',
            icon: Share2,
            color: 'text-accent-route bg-accent-route/10',
        },
        {
            id: 'mailchimp',
            name: 'Mailchimp',
            desc: 'Add respondents to automated email marketing campaigns',
            icon: Mail,
            color: 'text-yellow-500 bg-yellow-500/10',
        },
        {
            id: 'webhooks',
            name: 'Custom Webhooks',
            desc: 'Deliver raw JSON payloads to custom HTTP endpoints on submission',
            icon: Webhook,
            color: 'text-cyan-500 bg-cyan-500/10',
        },
    ];
    const toggleApp = (id) => {
        setConnectedApps((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (<div className="max-w-6xl mx-auto w-full space-y-8 p-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-bold border border-primary/20">
          <Globe className="h-4 w-4"/> Integrations Ecosystem
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
          Connect Your Form to 100+ SaaS Tools
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Automatically stream form answers into Google Sheets, Slack channels, CRMs, and custom webhooks without writing any code.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((app) => {
            const isConnected = !!connectedApps[app.id];
            const Icon = app.icon;
            return (<Card key={app.id} className={`relative rounded-3xl border transition-all duration-200 shadow-sm ${isConnected
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-border bg-card hover:border-primary/50'}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${app.color}`}>
                    <Icon className="h-6 w-6"/>
                  </div>

                  <Button variant={isConnected ? 'outline' : 'default'} size="sm" onClick={() => toggleApp(app.id)} className={`rounded-full text-xs font-bold px-4 h-8 transition-all ${isConnected
                    ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                    {isConnected ? (<span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5"/> Connected
                      </span>) : ('Connect')}
                  </Button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground font-sans">
                    {app.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {app.desc}
                  </p>
                </div>
              </CardContent>
            </Card>);
        })}
      </div>
    </div>);
}
