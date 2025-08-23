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
