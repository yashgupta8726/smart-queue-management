import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";

import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";

import Analytics from "./pages/Analytics";

import CompletedOrders from "./pages/CompletedOrders";

import TakeOrder from "./pages/TakeOrder";

import Track from "./pages/Track";

import ProtectedRoute from "./components/ProtectedRoute";

function App(){

return(

<BrowserRouter>

<Routes>

<Route

path="/"

element={
<Login/>
}

/>

<Route

path="/admin"

element={

<ProtectedRoute>

<Dashboard/>

</ProtectedRoute>

}

/>

<Route

path="/analytics"

element={

<ProtectedRoute>

<Analytics/>

</ProtectedRoute>

}

/>

<Route

path="/completed"

element={

<ProtectedRoute>

<CompletedOrders/>

</ProtectedRoute>

}

/>

<Route

path="/take-order"

element={

<ProtectedRoute>

<TakeOrder/>

</ProtectedRoute>

}

/>

<Route

path="/track"

element={

<Track/>

}

/>

</Routes>

</BrowserRouter>

);

}

export default App;