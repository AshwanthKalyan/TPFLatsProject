import { Switch, Route } from "wouter";

import Landing from "@/pages/landing";
import AuthPage from "@/pages/AuthPage";
import DashboardLayout from "@/pages/dashboard-layout";
import Projects from "@/pages/projects";
import ProjectDetails from "@/pages/project-details";
import Profile from "@/pages/profile";
import MyApplications from "@/pages/my-applications";
import MySubmissions from "@/pages/my-submissions";
import NotFound from "@/pages/not-found";

export default function Router() {
  return (
    <Switch>

      <Route path="/" component={Landing} />

      <Route path="/auth" component={AuthPage} />

      <Route path="/projects">
        {() => (
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/projects/:id">
        {() => (
          <DashboardLayout>
            <ProjectDetails />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/profile">
        {() => (
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/applications">
        {() => (
          <DashboardLayout>
            <MyApplications />
          </DashboardLayout>
        )}
      </Route>

      <Route path="/submissions">
        {() => (
          <DashboardLayout>
            <MySubmissions />
          </DashboardLayout>
        )}
      </Route>

      <Route component={NotFound} />

    </Switch>
  );
}
