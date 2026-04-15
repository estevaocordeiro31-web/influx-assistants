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
import EditProfile from "./pages/EditProfile";
import LessonsPage from "./pages/LessonsPage";
import TiagoPage from "./pages/TiagoPage";
import AdminTiagoSetup from "./pages/AdminTiagoSetup";
import AdminBulkSyncPage from "./pages/AdminBulkSyncPage";
import { AccessBlockedPage } from "./pages/AccessBlockedPage";
import { XPToastContainer } from "./components/XPToast";
import ElliesSupportPage from "./pages/ElliesSupportPage";
import SupportTicketsPage from "./pages/SupportTicketsPage";
import InfluxPassportPage from "./pages/InfluxPassportPage";
import { BackToSchoolAdminPage } from "./pages/BackToSchoolAdminPage";
import { BackToSchoolDashboard } from "./pages/BackToSchoolDashboard";
import AdminActivitiesPage from "./pages/AdminActivitiesPage";
import PassportCheckInPage from "./pages/PassportCheckInPage";
import PassportSyncPage from "./pages/PassportSyncPage";
import StudentStatsPage from "./pages/StudentStatsPage";
import TestLoginDebug from "./pages/TestLoginDebug";
import ExtraExercisesPage from "./pages/ExtraExercisesPage";
import ChangePassword from "./pages/ChangePassword";
import BadgesPage from "./pages/BadgesPage";
import ThemeSelector from "./pages/ThemeSelector";
import ElieAvatarPage from "./pages/ElieAvatarPage";
import PresenceDashboard from "./components/PresenceDashboard";
import TotemMode from "./pages/TotemMode";
import StudentPassport from "./pages/StudentPassport";
import VacationPlus2 from "./pages/VacationPlus2";
import VacationPlus2Lesson from "./pages/VacationPlus2Lesson";
import TotemManager from "./pages/admin/TotemManager";
import StudentSplash from "./pages/StudentSplash";
import StudentOnboarding from "./pages/StudentOnboarding";
import StudentHomeNew from "./pages/StudentHomeNew";
import StudentChatNew from "./pages/StudentChatNew";

function Router() {
  const { isAuthenticated, user, loading } = useAuth();

  // Acesso liberado para todos - bloqueio removido
  const isAccessBlocked = () => {
    return false; // Todos têm acesso imediato
  };

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

  // Acesso liberado para todos

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/student/splash" component={StudentSplash} />
      <Route path="/student/onboarding" component={StudentOnboarding} />
      <Route path="/student/home" component={StudentHomeNew} />
      <Route path="/student/chat-elie" component={StudentChatNew} />
      <Route path="/login" component={Login} />
      <Route path="/change-password" component={ChangePassword} />
      <Route path="/logout" component={ForceLogout} />
      <Route path="/login-direct/:token" component={DirectLogin} />
      {/* Rotas de demonstração - acessíveis sem autenticação para teste */}
      <Route path="/demo" component={StudentDashboard} />
      <Route path="/demo/chat" component={Chat} />
      <Route path="/demo/exercises" component={Exercises} />
      <Route path="/demo/voice-chat" component={VoiceChatPage} />
      <Route path="/demo/blog-tips" component={BlogTips} />
      <Route path="/demo/simulator" component={SituationSimulator} />
      <Route path="/lessons" component={LessonsPage} />
      <Route path="/demo/lessons" component={LessonsPage} />
      {/* Rotas de acesso via link personalizado */}
      <Route path="/access/:linkHash" component={AccessViaLink} />
      {/* Rotas autenticadas */}
      <Route path="/student/dashboard" component={StudentDashboard} />
      <Route path="/student/profile" component={StudentProfile} />
      <Route path="/student/edit-profile" component={EditProfile} />
      <Route path="/student/chat" component={Chat} />
      <Route path="/student/exercises" component={Exercises} />
      <Route path="/student/voice-chat" component={VoiceChatPage} />
      <Route path="/student/blog-tips" component={BlogTips} />
      <Route path="/student/simulator" component={SituationSimulator} />
      <Route path="/student/passport" component={InfluxPassportPage} />
      <Route path="/student/extra-exercises/:bookId/:lessonNumber" component={ExtraExercisesPage} />
      <Route path="/student/extra-exercises" component={ExtraExercisesPage} />
      <Route path="/student/themes" component={ThemeSelector} />
      <Route path="/student/badges" component={BadgesPage} />
      <Route path="/student/elie" component={ElieAvatarPage} />
      <Route path="/student/presence" component={PresenceDashboard} />
      <Route path="/book/vacation-plus-2" component={VacationPlus2} />
      <Route path="/book/vacation-plus-2/lesson/:lessonNumber" component={VacationPlus2Lesson} />
      <Route path="/passport/:studentId" component={StudentPassport} />
      <Route path="/totem/:totemId" component={TotemMode} />
      <Route path="/passport/checkin" component={PassportCheckInPage} />
      <Route path="/passport/sync" component={PassportSyncPage} />
      {/* Rota exclusiva para Tiago */}
      {isAuthenticated && user?.email === "tiago.laerte@icloud.com" && (
        <Route path="/tiago" component={TiagoPage} />
      )}
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/notifications" component={AdminNotifications} />
          <Route path="/admin/personalized-links" component={PersonalizedLinksManager} />
          <Route path="/admin/upload-materials" component={MaterialUploadPage} />
          <Route path="/admin/gemini-suggestions" component={GeminiSuggestions} />
          <Route path="/admin/gemini-analysis" component={GeminiStrategicAnalysis} />
          <Route path="/admin/gemini-chat" component={GeminiChat} />
          <Route path="/admin/tiago-setup" component={AdminTiagoSetup} />
          <Route path="/admin/bulk-sync" component={AdminBulkSyncPage} />
          <Route path="/support/ellie" component={ElliesSupportPage} />
          <Route path="/support/tickets" component={SupportTicketsPage} />
          <Route path="/admin/back-to-school" component={BackToSchoolAdminPage} />
          <Route path="/admin/back-to-school-dashboard" component={BackToSchoolDashboard} />
          <Route path="/admin/activities" component={AdminActivitiesPage} />
          <Route path="/admin/totems" component={TotemManager} />
        </>
      )}
      {/* Rotas de demonstração admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/student-stats" component={StudentStatsPage} />
      <Route path="/admin/notifications" component={AdminNotifications} />
      <Route path="/admin/personalized-links" component={PersonalizedLinksManager} />
      <Route path="/admin/upload-materials" component={MaterialUploadPage} />
      <Route path="/support/ellie" component={ElliesSupportPage} />
      <Route path="/support/tickets" component={SupportTicketsPage} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/test-login-debug" component={TestLoginDebug} />
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
          <XPToastContainer />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
