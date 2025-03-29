import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./Components/Home";
import Appoinments from "./Components/Appoinments";
import Doctors from "./Components/Doctors";
import Contact from "./Components/Contact";
import Navbar from "./Components/Navbar";
import AboutUs from "./Components/AboutUs";
import Footer from "./Components/Footer";
import Feedback from "./Components/Feedback";
import { AuthProvider } from "./Components/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about_us", element: <AboutUs /> },
      { path: "/appointment", element: <Appoinments /> },
      { path: "/our_doctors", element: <Doctors /> },
      { path: "/enquiry", element: <Contact /> },
      { path: "/feed_back", element: <Feedback /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
