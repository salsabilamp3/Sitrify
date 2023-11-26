import React, { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import AvatarProfile from "../components/profile";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PrediksiPage = () => {
  const [id_artist, setIdArtist] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [songsData, setSongsData] = useState([]);
  const [predictResult, setPredictResult] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("id_artist");
    GetDataSongs(id);
  }, []);

  const GetDataSongs = async (id_artist) => {
    try {
      setIsLoading(true);
      if (!id_artist) {
        return;
      }
      const songsResponse = await fetch(
        `http://localhost:5000/api/songs/${id_artist}`
      );
      const songsData = await songsResponse.json();
      setSongsData(songsData.songs);

      console.log(songsData.songs);
    } catch (error) {
      console.error("Error fetching chart data:", error.message);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  const handlePredict = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/predict/${id_artist}`);
      const data = await response.json();
      if (response.ok) {
        setPredictResult(data.prediction);
        console.log("Predict result:", data.prediction);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  return (
    <div className="flex">
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="content-start flex">
          <p className="font-bold text-3xl text-white pl-4 pb-4">
            Prediksi Popularitas Lagu
          </p>
        </div>
        <div className="pl-4">
          <div className="card bg-[#453158] shadow-xl">
            <div className="card-body p-0">
              <h2 className="card-title pb-2 text-white">Daftar Lagu</h2>
              <div className="bg-[#453158] overflow-x-auto ">
                {isLoading ? (
                  <div className="w-full flex items-center justify-center text-white">
                    <AiOutlineLoading3Quarters
                      className="animate-spin mr-2"
                    />
                    Loading ...
                  </div>
                ) : (
                <table cellPadding={0} cellSpacing={0} className="table rounded-md border-separate datatable">
                  {/* head */}
                  <thead className="text-white bg-[#29163a] text-sm">
                    <tr>
                      <th>#</th>
                      <th>Judul Lagu</th>
                      <th>Tanggal Rilis</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#29163A" }}>
                    {songsData.map((song, index) => (
                      <tr className="text-white" key={song.id_song}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={song.image}
                                  alt={song.title}
                                />
                              </div>
                            </div>
                            <div>
                              {song.title}
                            </div>
                          </div>
                        </td>
                        <td>{formatDate(song.release_date)}</td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              document
                                .getElementById("modal_prediksi")
                                .showModal()
                            }
                          >
                            Prediksi
                          </button>
                          {/* Modal hasil prediksi */}
                          <dialog id="modal_prediksi" className="modal">
                            <div
                              className="modal-box"
                              style={{
                                backgroundColor: "#EADCF8",
                                color: "#29163A",
                              }}
                            >
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>

                              <h3 className="font-bold text-2xl text-center p-5 underline">
                                Hasil Prediksi
                              </h3>
                              <div className="ml-4">
                                <p className="py-4 font-bold text-xl">
                                  Judul Lagu
                                </p>
                                <div className="flex items-center space-x-3">
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-12 h-12">
                                      <img
                                        src="/image/profile.jpg"
                                        alt="Avatar Tailwind CSS Component"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-md">
                                      Zemlak, Daniel and Leannon
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <h3 className="font-bold text-3xl text-center p-10 ">
                                Lagu akan Hits!
                              </h3>
                            </div>
                          </dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrediksiPage;
