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
import BadgesPage from "./pages/BadgesPage";
import ChangePassword from "./pages/ChangePassword";
import EventLanding from "./pages/events/EventLanding";
import EventHub from "./pages/events/EventHub";
import ChunkLesson from "./pages/events/ChunkLesson";
import CultureQuiz from "./pages/events/CultureQuiz";
import ChunkListening from "./pages/events/ChunkListening";
import SpeakingChallenge from "./pages/events/SpeakingChallenge";
import FoodChallenge from "./pages/events/FoodChallenge";
import EventLeaderboard from "./pages/events/Leaderboard";
import EventScore from "./pages/events/EventScore";
import TongueTwisterChallenge from "./pages/events/TongueTwisterChallenge";
import WhoAmIGame from "./pages/events/WhoAmIGame";
import FinishTheLyrics from "./pages/events/FinishTheLyrics";
import HotSeatGame from "./pages/events/HotSeatGame";
import HotSeatPresenter from "./pages/events/HotSeatPresenter";
import StPatricksIntro from "./pages/events/StPatricksIntro";
import StPatricksIntroTV from "./pages/events/StPatricksIntroTV";
import StPatricksIntroKids from "./pages/events/StPatricksIntroKids";
import WelcomeScreen from "./pages/events/WelcomeScreen";
import EventRegister from "./pages/events/EventRegister";
import EventWelcome from "./pages/events/EventWelcome";
import MineracaoHistoricoPage from "./pages/MineracaoHistoricoPage";
import LeaderboardTV from "./pages/events/LeaderboardTV";
import ReceptionTV from "./pages/events/ReceptionTV";
import TeacherDashboard from "./pages/events/TeacherDashboard";
import KidsHub from "./pages/events/KidsHub";
import KidsTongueTwister from "./pages/events/KidsTongueTwister";
import ClosingCeremony from "./pages/events/ClosingCeremony";
import KidsWhoAmI from "./pages/events/KidsWhoAmI";
import KidsSingAlong from "./pages/events/KidsSingAlong";

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
      <Route path="/student/badges" component={BadgesPage} />
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
          <Route path="/admin/mineracao-historico" component={MineracaoHistoricoPage} />
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
      {/* Rotas do módulo Cultural Events — acessíveis sem login */}
      <Route path="/events" component={EventLanding} />
      <Route path="/events/hub" component={EventHub} />
      <Route path="/events/chunk-lesson" component={ChunkLesson} />
      <Route path="/events/culture-quiz" component={CultureQuiz} />
      <Route path="/events/chunk-listening" component={ChunkListening} />
      <Route path="/events/speaking-challenge" component={SpeakingChallenge} />
      <Route path="/events/food-challenge" component={FoodChallenge} />
      <Route path="/events/leaderboard" component={EventLeaderboard} />
      <Route path="/events/score" component={EventScore} />
      <Route path="/events/tongue-twister" component={TongueTwisterChallenge} />
      <Route path="/events/who-am-i" component={WhoAmIGame} />
      <Route path="/events/finish-lyrics" component={FinishTheLyrics} />
      <Route path="/events/hot-seat" component={HotSeatGame} />
      <Route path="/events/hot-seat-tv" component={HotSeatPresenter} />
      <Route path="/events/intro" component={StPatricksIntro} />
      <Route path="/events/intro-tv" component={StPatricksIntroTV} />
      <Route path="/events/kids/intro" component={StPatricksIntroKids} />
      <Route path="/events/welcome-screen" component={WelcomeScreen} />
      <Route path="/events/register" component={EventRegister} />
      <Route path="/events/welcome" component={EventWelcome} />
      <Route path="/events/leaderboard-tv" component={LeaderboardTV} />
      <Route path="/events/reception-tv" component={ReceptionTV} />
      <Route path="/events/teacher" component={TeacherDashboard} />
      <Route path="/events/closing" component={ClosingCeremony} />
      <Route path="/events/kids" component={KidsHub} />
      <Route path="/events/kids/tongue-twister" component={KidsTongueTwister} />
      <Route path="/events/kids/who-am-i" component={KidsWhoAmI} />
      <Route path="/events/kids/sing-along" component={KidsSingAlong} />
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
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
