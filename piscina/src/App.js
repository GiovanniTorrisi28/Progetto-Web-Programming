import React from "react";
import './App.css';
import Home from './components/Home';
import About from "./components/About";
import Contact from "./components/Contact";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from "./components/Registration";
import Login from "./components/Login";
import Staff from "./components/Staff";
import Activities from "./components/Activities";
import Test1 from "./components/Test1";
import PersonalArea from "./components/PersonalArea";
import AdminStaff from "./components/AdminStaff";
import AdminActivities from "./components/AdminActivities";
import AdminSubscriptions from "./components/AdminSubscriptions";
import AdminEvents from "./components/AdminEvents";
import Dashboard from "./components/Dashboard";
import PrivateRoutes from './utils/PrivateRoutes'

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact></Contact>} />
        <Route exact path="/registration" element={<Registration />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/staff" element={<Staff />} />
        <Route exact path="/activities" element={<Activities />} />
        <Route exact path="/test" element={<Test1 />} />
        <Route element={<PrivateRoutes endPoint={"isUserLoggedIn"} />}>
          <Route exact path="/personalArea" element={<PersonalArea />} />
        </Route>
        <Route element={<PrivateRoutes endPoint={"isAdminLoggedIn"} />}>
          <Route exact path="/adminArea" element={<Dashboard />} />
          <Route exact path="/adminArea/staff" element={<AdminStaff />} />
          <Route exact path="/adminArea/activities" element={<AdminActivities />} />
          <Route exact path="/adminArea/subscriptions" element={<AdminSubscriptions />} />
          <Route exact path="/adminArea/events" element={<AdminEvents />} />
        </Route>
      </Routes>

    </BrowserRouter>

  );
}

export default App;
