import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router";
import LanguageSelector from "./components/LanguageSelector";
import ActivitiesPage from "./pages/ActivitiesPage";
import ProfilePage from "./pages/ProfilePage";
import CommentsPage from "./pages/CommentsPage";
import LoginPage from "./pages/LoginPage";
import { useUser } from "./context/UserContext";
import supabase from "./supabase/index";

const App = () => {
  const { user } = useUser();

  return (
    <Router>
      <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/activteiten" className="text-blue-600 hover:underline">
            Activiteiten
          </Link>
          {user && (
            <Link to="/profiel" className="text-blue-600 hover:underline">
              Profiel
            </Link>
          )}
          {user && (
            <Link to="/commentaar" className="text-blue-600 hover:underline">
              Commentaar
            </Link>
          )}
          {!user ? (
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          ) : (
            <button
              onClick={() => logout()}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          )}
        </div>
        <div>
          <LanguageSelector />
        </div>
      </nav>

      <Routes>
        <Route path="/activiteiten" element={<ActivitiesPage />} />
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/profiel" />}
        />
        <Route
          path="/profiel"
          element={user ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/commentaar"
          element={user ? <CommentsPage /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/activiteiten" />} />
      </Routes>
    </Router>
  );
};

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error.message);
  } else {
    window.location.reload();
  }
};

export default App;
