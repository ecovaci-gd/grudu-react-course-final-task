import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tweets from "./pages/Tweets";
import { getUserFromLocalStorage } from "./utils/getUserFromLocalStorage";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const user = getUserFromLocalStorage();
  return user.id ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tweets" element={<PrivateRoute element={<Tweets />} />} />
      </Routes>
    </Router>
  );
};

export default App;
