// App.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/Landing";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import HomePage from "./pages/Home";
import MyEventsPage from "./pages/MyEvents";
import CreateEventPage from "./pages/CreateEvent";
import SearchPage from "./pages/SearchPage";
import MyProfile from "./pages/MyProfile";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
