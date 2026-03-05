import { useMyApplications } from "@/hooks/use-applications";
import { Terminal, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function MyApplications() {
  const { data: applications, isLoading } = useMyApplications();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Terminal className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-display text-foreground border-l-4 border-primary pl-4 uppercase">My Transmissions</h1>
        <p className="text-muted-foreground mt-2 pl-5 font-mono">Track your active project applications.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 font-mono">
        {applications?.map(app => (
          <div key={app.id} className="border border-primary/20 bg-card p-6 hover:border-primary transition-colors flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                <Link href={`/projects/${app.projectId}`} className="hover:text-primary hover:underline flex items-center gap-2">
                  {app.project.title} <ExternalLink className="h-4 w-4" />
                </Link>
              </h3>
              <p className="text-muted-foreground text-sm max-w-xl truncate">{app.message}</p>
              <div className="text-xs text-primary/60">Applied on: {new Date(app.createdAt!).toLocaleDateString()}</div>
            </div>
            
            <div className="flex items-center md:items-start">
              <div className={`px-4 py-2 border-2 text-sm uppercase font-bold tracking-widest ${
                app.status === 'accepted' ? 'border-green-500 text-green-500 bg-green-500/10' :
                app.status === 'rejected' ? 'border-red-500 text-red-500 bg-red-500/10' :
                'border-yellow-500 text-yellow-500 bg-yellow-500/10 animate-pulse'
              }`}>
                {app.status}
              </div>
            </div>
          </div>
        ))}

        {applications?.length === 0 && (
          <div className="border-2 border-dashed border-primary/20 p-12 text-center text-muted-foreground">
            YOU HAVE NOT TRANSMITTED ANY APPLICATIONS YET.
          </div>
        )}
      </div>
    </div>
  );
}
