import { BrowserRouter, Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import Anime from "./pages/Anime";
import Settings from "./pages/Settings";
import EditAnime from "./pages/EditAnime";
import AddAnime from "./pages/AddAnime";
import AnimeList from "./pages/AnimeList";
import Manga from "./pages/Manga";
import AddManga from "./pages/AddManga";
import EditManga from "./pages/EditManga";
import MangaList from "./pages/MangaList";
import EditCharacters from "./pages/EditCharacters";
import AddCharacter from "./pages/AddCharacter";

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/register' element={<Register />} />
				<Route path='/login' element={<Login />} />
				<Route path='/profile/:username' element={<Profile />} />
				<Route path='/anime/:id' element={<Anime />} />
				<Route path='/settings' element={<Settings />} />
				<Route path='/edit/anime/:id' element={<PrivateRoute role='admin' />}>
					<Route index element={<EditAnime />} />
				</Route>
				<Route path='/add/anime' element={<PrivateRoute role='admin' />}>
					<Route index element={<AddAnime />} />
				</Route>
				<Route path='/:username/anime-list' element={<AnimeList />} />
				<Route path='/manga/:id' element={<Manga />} />
				<Route path='/add/manga' element={<AddManga />} />
				<Route path='/edit/manga/:id' element={<EditManga />} />
				<Route path='/:username/manga-list' element={<MangaList />} />
				<Route path='/edit/anime/:id/characters' element={<EditCharacters />} />
				<Route path='/characters/add' element={<AddCharacter />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
