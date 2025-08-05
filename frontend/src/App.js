import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Movies from "./pages/Movies";
import SearchResults from "./pages/SearchResults";
import Genres from "./pages/Genres";
import TopRated from "./pages/TopRated";

function App() {
  return (
    <div className="App min-h-screen bg-gray-950">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/top-rated" element={<TopRated />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;