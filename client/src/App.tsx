import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentProfile from "./pages/StudentProfile";
import Chat from "./pages/Chat";
import Exercises from "./pages/Exercises";
import Login from "./pages/Login";
import AdminNotifications from "./pages/AdminNotifications";
import VoiceChatPage from "./pages/VoiceChatPage";
import BlogTips from "./pages/BlogTips";
import SituationSimulator from "./pages/SituationSimulator";
import { AccessViaLink } from "./pages/AccessViaLink";
import { PersonalizedLinksManager } from "./pages/PersonalizedLinksManager";
import { MaterialUploadForm } from "./components/MaterialUploadForm";
import MaterialUploadPage from "./pages/MaterialUploadPage";
import TestLogin from "./pages/TestLogin";
import StudentProfileEditPage from "./pages/StudentProfileEditPage";
import StudentCrossAnalysisPage from "./pages/StudentCrossAnalysisPage";
import ImportStudentDataPage from "./pages/ImportStudentDataPage";
import ForceLogout from "./pages/ForceLogout";
import DirectLogin from "./pages/DirectLogin";
import GeminiSuggestions from "./pages/GeminiSuggestions";
import GeminiStrategicAnalysis from "./pages/GeminiStrategicAnalysis";
import GeminiChat from "./pages/GeminiChat";

function Router() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={ForceLogout} />
      <Route path="/login-direct/:token" component={DirectLogin} />
      {/* Rotas de demonstração - acessíveis sem autenticação para teste */}
      <Route path="/demo" component={StudentDashboard} />
      <Route path="/demo/chat" component={Chat} />
      <Route path="/demo/exercises" component={Exercises} />
      <Route path="/demo/voice-chat" component={VoiceChatPage} />
      <Route path="/demo/blog-tips" component={BlogTips} />
      <Route path="/demo/simulator" component={SituationSimulator} />
      {/* Rotas de acesso via link personalizado */}
      <Route path="/access/:linkHash" component={AccessViaLink} />
      {/* Rotas autenticadas */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/profile" component={StudentProfile} />
      <Route path="/student/chat" component={Chat} />
      <Route path="/student/exercises" component={Exercises} />
      <Route path="/student/voice-chat" component={VoiceChatPage} />
      <Route path="/student/blog-tips" component={BlogTips} />
      <Route path="/student/simulator" component={SituationSimulator} />
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/notifications" component={AdminNotifications} />
          <Route path="/admin/personalized-links" component={PersonalizedLinksManager} />
          <Route path="/admin/upload-materials" component={MaterialUploadPage} />
          <Route path="/admin/gemini-suggestions" component={GeminiSuggestions} />
          <Route path="/admin/gemini-analysis" component={GeminiStrategicAnalysis} />
          <Route path="/admin/gemini-chat" component={GeminiChat} />
        </>
      )}
      {/* Rotas de demonstração admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/personalized-links" component={PersonalizedLinksManager} />
      <Route path="/admin/upload-materials" component={MaterialUploadPage} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/admin/student/:studentId/edit" component={StudentProfileEditPage} />
      <Route path="/admin/student/:studentId/analysis" component={StudentCrossAnalysisPage} />
      <Route path="/admin/import-student-data" component={ImportStudentDataPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
