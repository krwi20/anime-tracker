import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { FiPlusCircle, FiPlusSquare } from "react-icons/fi";

import {
  getSpecificAnimeStart,
  getSpecificAnimeSuccess,
  getSpecificAnimeFailure,
} from "../redux/anime/animeSlice";

const Anime = () => {
  const { id } = useParams();
  const { fetchedSpecificAnime, loading } = useSelector((state) => state.anime);
  const dispatch = useDispatch();

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    // Options for formatting the date, adjust as needed
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    const fetchSpecificAnime = async () => {
      try {
        dispatch(getSpecificAnimeStart());
        const res = await fetch(`http://localhost:3001/api/anime/anime/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(getSpecificAnimeFailure(data));
          return;
        }
        dispatch(getSpecificAnimeSuccess(data));
      } catch (error) {
        dispatch(getSpecificAnimeFailure(error));
      }
    };

    fetchSpecificAnime();
  }, [dispatch]);

  return (
    <div className="bg-[#171717] border-t-white border-t-2 min-h-[calc(100vh-64px)] ">
      {loading && <p className="text-[#ededed]">Loading...</p>}
      {fetchedSpecificAnime && (
        <div className="bg-[#202020] text-[#ededed] mx-6 mt-6 px-2 rounded-lg">
          <div className="border-b border-[#ededed] border-opacity-25 mb-2">
            <h1 className="text-white">{fetchedSpecificAnime.title}</h1>
            <h1>{fetchedSpecificAnime.title_jp}</h1>
          </div>
          <div className="flex gap-2">
            {/* Left Side */}
            <div className="flex flex-col w-72 gap-2">
              <img
                src={fetchedSpecificAnime.customImageURL}
                alt="anime_cover"
                className="mb-2"
              />
              <p className="text-md border-b border-[#da0037]">
                Alternative Titles
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Japanese:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.title_jp}
                </span>
              </p>
              <p className="text-md border-b border-[#da0037]">Information</p>
              <p className="text-xs font-bold whitespace-nowrap">
                Type:{" "}
                <span className="font-normal">{fetchedSpecificAnime.type}</span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Status:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.status}
                </span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Aired:{" "}
                <span className="font-normal">
                  {formatDate(fetchedSpecificAnime.airedFrom)}
                </span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Premiered:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.season} {fetchedSpecificAnime.year}
                </span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Broadcast:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.broadcast.day}{" "}
                  {fetchedSpecificAnime.broadcast.time}{" "}
                  {fetchedSpecificAnime.broadcast.timezone}
                </span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Duration:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.duration}
                </span>
              </p>
              <p className="text-xs font-bold whitespace-nowrap">
                Rating:{" "}
                <span className="font-normal">
                  {fetchedSpecificAnime.rating}
                </span>
              </p>
            </div>
            {/* Right Side */}
            <div className="flex flex-col border-l border-[#ededed] border-opacity-25 pl-2 w-full">
              <div className="flex gap-4 bg-[#171717] p-4 rounded-md w-fit">
                <button className="bg-[#da0037] w-fit px-2 py-1 rounded-lg text-xs flex items-center">
                  <FiPlusSquare />
                  <span className="ml-1">Add to List</span>
                </button>
                <select
                  className="bg-[#da0037] text-xs px-2 py-1 rounded-lg"
                  name="Select"
                  id=""
                >
                  <option value="">Select</option>
                  <option value="">(10) Masterpiece</option>
                  <option value="">(9) Great</option>
                  <option value="">(8) Very Good</option>
                  <option value="">(7) Good</option>
                  <option value="">(6) Fine</option>
                  <option value="">(5) Average</option>
                  <option value="">(4) Bad</option>
                  <option value="">(3) Very Bad</option>
                  <option value="">(2) Horrible</option>
                  <option value="">(1) Appaling</option>
                </select>
                <div className="bg-[#da0037] text-xs px-2 py-1 rounded-lg flex items-center">
                  Episodes:
                  <input
                    className="bg-[#da0037] text-[#ededed] text-right w-6 "
                    type="text"
                    value={0}
                  />{" "}
                  / <span>{fetchedSpecificAnime.episodes}</span>
                  <button className="ml-2">
                    <FiPlusCircle />
                  </button>
                </div>
              </div>
              <h1 className="border-b border-[#da0037]">Description</h1>
              <p>{fetchedSpecificAnime.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anime;
