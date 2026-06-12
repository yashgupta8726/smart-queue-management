import {BrowserRouter,Routes,Route}
from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TakeOrder from "./pages/TakeOrder";
import Track from "./pages/Track";

function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>

<Route path="/admin"
element={<Dashboard/>}/>

<Route path="/take-order"
element={<TakeOrder/>}/>

<Route path="/track"
element={<Track/>}/>

</Routes>

</BrowserRouter>

)

}

export default App