import { useProject } from "@/hooks/use-projects";
import { useProjectApplications, useCreateApplication, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import { useRoute } from "wouter";
import { Terminal, ArrowLeft, Send, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function ProjectDetails() {
  const [, params] = useRoute("/projects/:id");
  const projectId = Number(params?.id);
  const { data: project, isLoading } = useProject(projectId);
  const { data: applications } = useProjectApplications(projectId);
  const { user } = useAuth();
  const applyMutation = useCreateApplication(projectId);
  const updateStatusMutation = useUpdateApplicationStatus();
  
  const [showApply, setShowApply] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Terminal className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  if (!project) return <div className="text-primary font-mono text-xl">ERROR 404: DATA NOT FOUND</div>;

  const isCreator = user?.id === project.creatorId;
  const hasApplied = applications?.some(a => a.applicantId === user?.id);

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    applyMutation.mutate({
      resumeUrl: (fd.get('resumeUrl') as string) || null,
      message: (fd.get('message') as string) || null,
    }, {
      onSuccess: () => setShowApply(false)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <Link href="/projects" className="inline-flex items-center gap-2 text-primary hover:text-white font-mono uppercase tracking-wider transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to grid
      </Link>

      <div className="border-2 border-primary bg-card p-6 md:p-8 brutal-shadow relative">
        <div className="absolute top-0 right-0 bg-primary text-background px-4 py-2 font-display font-bold text-sm tracking-widest">
          {project.projectType}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-display text-foreground uppercase tracking-tighter mb-4 pr-24">
          {project.title}
        </h1>
        
        <div className="flex items-center gap-4 mb-8 text-sm font-mono text-muted-foreground border-b border-primary/20 pb-6">
          <span>CREATOR: <span className="text-foreground">{project.creator.firstName || project.creator.email}</span></span>
          <span>•</span>
          <span>DURATION: <span className="text-foreground">{project.duration}</span></span>
          <span>•</span>
          <span>NEEDED: <span className="text-primary font-bold">{project.collaboratorsNeeded}</span></span>
        </div>

        <div className="space-y-8 font-mono">
          <div>
            <h3 className="text-primary uppercase tracking-widest text-sm mb-3">System Description</h3>
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-primary uppercase tracking-widest text-sm mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(t => (
                  <span key={t} className="border border-primary/50 bg-background px-3 py-1.5 text-sm">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-primary uppercase tracking-widest text-sm mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.skillsRequired.map(s => (
                  <span key={s} className="border border-secondary/50 bg-background text-secondary px-3 py-1.5 text-sm">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-primary uppercase tracking-widest text-sm mb-3">Comms Link</h3>
            <div className="bg-background border border-primary/20 p-4 font-mono text-foreground inline-block">
              {project.contactInfo}
            </div>
          </div>
        </div>

        {!isCreator && !hasApplied && !showApply && (
          <div className="mt-12 pt-8 border-t border-primary/20 flex justify-end">
            <button 
              onClick={() => setShowApply(true)}
              className="bg-primary text-background px-8 py-4 font-display font-bold uppercase tracking-widest text-xl hover:bg-white transition-colors brutal-shadow flex items-center gap-3"
            >
              <Send className="h-6 w-6" /> Transmit Application
            </button>
          </div>
        )}

        {hasApplied && !isCreator && (
          <div className="mt-12 pt-8 border-t border-primary/20 text-right">
            <div className="inline-block border-2 border-primary/50 text-primary px-6 py-3 font-mono font-bold tracking-widest">
              APPLICATION TRANSMITTED. AWAITING RESPONSE.
            </div>
          </div>
        )}
      </div>

      {showApply && (
        <div className="border-2 border-secondary bg-card p-6 brutal-shadow-secondary animate-in slide-in-from-top-4">
          <h2 className="text-2xl font-display text-secondary uppercase mb-6">Transmit Credentials</h2>
          <form onSubmit={handleApply} className="space-y-4 font-mono">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground uppercase">Resume URL (Optional)</label>
              <input name="resumeUrl" placeholder="https://..." className="w-full bg-background border border-secondary/30 p-3 text-foreground focus:outline-none focus:border-secondary transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground uppercase">Transmission Message</label>
              <textarea name="message" rows={4} placeholder="Why you fit this system..." required className="w-full bg-background border border-secondary/30 p-3 text-foreground focus:outline-none focus:border-secondary transition-colors" />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={() => setShowApply(false)} className="px-6 py-2 text-muted-foreground hover:text-foreground">CANCEL</button>
              <button type="submit" disabled={applyMutation.isPending} className="bg-secondary text-background px-8 py-3 font-bold brutal-shadow-secondary hover:bg-white disabled:opacity-50 transition-all">
                {applyMutation.isPending ? "SENDING..." : "SEND"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isCreator && applications && applications.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-display text-foreground border-l-4 border-primary pl-4 uppercase">Applicant Data</h2>
          <div className="grid grid-cols-1 gap-4">
            {applications.map(app => (
              <div key={app.id} className="border border-primary/30 bg-card p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-2 font-mono flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground">{app.applicant.firstName || app.applicant.email}</span>
                    <span className={`px-2 py-0.5 text-xs uppercase border ${
                      app.status === 'accepted' ? 'border-green-500 text-green-500' :
                      app.status === 'rejected' ? 'border-red-500 text-red-500' :
                      'border-yellow-500 text-yellow-500'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{app.message}</p>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline block text-sm">
                      [VIEW_RESUME]
                    </a>
                  )}
                </div>
                
                {app.status === 'pending' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'accepted' })}
                      disabled={updateStatusMutation.isPending}
                      className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-background px-4 py-2 flex items-center gap-2 font-mono font-bold transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" /> ACCEPT
                    </button>
                    <button 
                      onClick={() => updateStatusMutation.mutate({ id: app.id, status: 'rejected' })}
                      disabled={updateStatusMutation.isPending}
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-background px-4 py-2 flex items-center gap-2 font-mono font-bold transition-colors"
                    >
                      <XCircle className="h-4 w-4" /> REJECT
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
