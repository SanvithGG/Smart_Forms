import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Eye, CheckCircle2, Clock, TrendingUp, Search } from 'lucide-react';
export function TypeformResultsView() {
    const [searchTerm, setSearchTerm] = useState('');
    const metrics = [
        { label: 'Total Views', value: '1,420', icon: Eye, color: 'text-blue-500 bg-blue-500/10' },
        { label: 'Starts', value: '1,150', icon: TrendingUp, color: 'text-accent-branch bg-accent-branch/10' },
        { label: 'Submissions', value: '890', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
        { label: 'Completion Rate', value: '77.4%', icon: BarChart3, color: 'text-accent-route bg-accent-route/10' },
        { label: 'Avg Time to Complete', value: '1m 45s', icon: Clock, color: 'text-cyan-500 bg-cyan-500/10' },
    ];
    const submissions = [
        { id: 'sub_901', date: '2026-08-01 19:42', Q1: 'Yes, absolutely', Q2: 'Component-driven architecture', status: 'Completed' },
        { id: 'sub_902', date: '2026-08-01 19:35', Q1: 'Somewhat / Neutral', Q2: 'Fewer re-render surprises', status: 'Completed' },
        { id: 'sub_903', date: '2026-08-01 19:20', Q1: 'No, not really', Q2: 'Prefer Vue / Svelte simplicity', status: 'Completed' },
        { id: 'sub_904', date: '2026-08-01 18:55', Q1: 'Never tried it', Q2: 'Happy with current tech stack', status: 'Completed' },
        { id: 'sub_905', date: '2026-08-01 18:10', Q1: 'Yes, absolutely', Q2: 'Instant Hot Reload & Fast Refresh', status: 'Completed' },
    ];
    const filteredSubmissions = submissions.filter((s) => s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.Q1.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.Q2.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className="max-w-6xl mx-auto w-full space-y-8 p-6 animate-in fade-in duration-200 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-bold border border-primary/20">
            <BarChart3 className="h-4 w-4"/> Real-time Analytics & Submissions
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Form Results Summary
          </h2>
        </div>

        <Button onClick={() => alert('Downloading submissions CSV...')} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-5 gap-2 shadow-sm">
          <Download className="h-4 w-4"/> Export CSV
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (<Card key={idx} className="rounded-2xl border border-border bg-card p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">{m.label}</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${m.color}`}>
                  <Icon className="h-4 w-4"/>
                </div>
              </div>
              <p className="text-2xl font-extrabold text-foreground font-sans tracking-tight">
                {m.value}
              </p>
            </Card>);
        })}
      </div>

      {/* Submissions Data Table */}
      <Card className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <h3 className="text-base font-bold text-foreground font-sans">
            Responses Data Table ({submissions.length} total)
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
            <input type="text" placeholder="Search responses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-1.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"/>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Submission ID</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Q1 Answer</th>
                <th className="py-3 px-3">Q2 Answer</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredSubmissions.map((s) => (<tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-primary">{s.id}</td>
                  <td className="py-3.5 px-3 font-mono text-muted-foreground">{s.date}</td>
                  <td className="py-3.5 px-3 font-bold text-foreground">{s.Q1}</td>
                  <td className="py-3.5 px-3 text-muted-foreground">{s.Q2}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                      {s.status}
                    </span>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>);
}
