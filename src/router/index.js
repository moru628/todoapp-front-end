import React from 'react'
import Home from '../pages/Home'
import List from '../pages/List'
import Event from '../pages/Event'
import Moment from '../pages/Moment'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import EventDetails from '../pages/EventDetails'
import Booking from '../pages/Booking'
import { createBrowserRouter } from 'react-router-dom'
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />
    },
    {
        path: "/list",
        element: <List />
    },
    {
        path: "/event",
        element: <Event />
    },
    {
        path:"/event/details/:eventId",
        element: <EventDetails />
    },
    {
        path: "/booking/:eventId",
        element: <Booking />
    },
    {
        path: "/moment",
        element: <Moment />
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/login",
        element:<Login />
    },
    {
        path: "/register",
        element: <Signup />
    }
])

export default router