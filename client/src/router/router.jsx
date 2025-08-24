import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AllRooms from "../pages/AllRooms";
import RoomDetails from "../pages/RoomDetails";
import MyPosts from "../pages/MyPosts";
import UpdateRoom from "../pages/UpdateRoom";
import { AddRoom } from "../pages/AddRoom";
import PrivateRoute from "./PrivateRoute";
import About from "../pages/About";
import Register from "../pages/Register";
import MyBookingRooms from "../pages/MyBookingRooms";
import MyProfile from "../pages/MyProfile";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/my-booking-rooms",
        element: (
          <PrivateRoute>
            <MyBookingRooms></MyBookingRooms>
          </PrivateRoute>
        ),
      },
      {
        path: "/all-rooms",
        element: <AllRooms></AllRooms>,
      },
      {
        path: "/rooms/:id",
        element: (
          <PrivateRoute>
            <RoomDetails></RoomDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-posts",
        element: <MyPosts></MyPosts>,
      },
      {
        path: "/my-profile",
        element: (
          <PrivateRoute>
            <MyProfile></MyProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard></Dashboard>
          </PrivateRoute>
        ),
      },
      {
        path: "/update-room/:id",
        element: <UpdateRoom></UpdateRoom>,
      },
      {
        path: "/about",
        element: <About></About>,
      },
      {
        path: "/add-room",
        element: (
          <PrivateRoute>
            <AddRoom></AddRoom>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
