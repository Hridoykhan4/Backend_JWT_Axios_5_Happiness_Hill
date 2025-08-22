import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Login from "../pages/Login";
import AllRooms from "../pages/AllRooms";
import RoomDetails from "../pages/RoomDetails";
import MyPosts from "../pages/MyPosts";

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
        path: '/rooms/:id',
        element: <RoomDetails></RoomDetails>
      },
      {
        path: '/my-posts',
        element: <MyPosts></MyPosts>
      },
      
    ],
  },
]);

export default router;
