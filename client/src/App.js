import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
