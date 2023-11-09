import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				{/* <Route path='/profile/:username' element={<PrivateRoute />}>
					<Route index element={<Profile />} />
				</Route> */}
				<Route path='/profile/:username' element={<Profile />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
