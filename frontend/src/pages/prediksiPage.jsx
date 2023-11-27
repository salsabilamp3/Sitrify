import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "simple-datatables";
const PrediksiPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [songsData, setSongsData] = useState([]);
  const [predictResult, setPredictResult] = useState("");
  let datatable;

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
    } 
    finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }

  useEffect(() => {
    const id = localStorage.getItem("id_artist");
    GetDataSongs(id);
  }, []);

  useEffect(() => {
  const initializeDataTable = async () => {
    if (songsData.length > 0) {
      datatable = new simpleDatatables.DataTable("#myTable", {
        pagination: true,
      });

      datatable.on("datatable.init", () => {
        setIsLoading(false);
        datatable.refresh();
      });

      // Menangani klik tombol Prediksi
      const buttons = document.querySelectorAll('.btn-prediksi');

      buttons.forEach(button => {
        button.addEventListener('click', async () => {
          const songId = button.dataset.id;

          const result = await handlePredict(songId);

          const modalElement = document.getElementById(`modal_prediksi_${songId}`);
          const textElement = modalElement.querySelector('.prediction-text');

          if (result === true) {
            textElement.textContent = "Lagu akan Hits!";
          } else {
            textElement.textContent = "Lagu tidak akan Hits.";
          }

          // Setelah prediksi selesai, tampilkan modal
          document.getElementById(`modal_prediksi_${songId}`).showModal();
        });
      });
    }
  };

  initializeDataTable();
  }, [songsData]);
  

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  const handlePredict = async (id_song) => {
    console.log("id_song:", id_song);
    try {
      const response = await fetch(`http://localhost:5000/api/song/predict/${id_song}`);
      const data = await response.json();
      if (response.ok) {
        setPredictResult(data.prediction);
        console.log("Predict result:", data.prediction);
        return data.prediction;
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
                {isLoading && (
                  <div className="w-full flex items-center justify-center text-white">
                    <AiOutlineLoading3Quarters
                      className="animate-spin mr-2"
                    />
                    Loading ...
                  </div>
                )}
                <div
                  className={`bg-[#453158] overflow-x-auto ${
                    isLoading ? "hidden" : ""
                  }`}
                >
                  <table id="myTable" className="table bg-[#453158]">
                    {/* head */}
                    <thead className="text-white bg-[#29163a] text-sm">
                      <tr>
                        <th><p className="text-white">#</p></th>
                        <th><p className="text-white">Judul Lagu</p></th>
                        <th><p className="text-white">Tanggal Rilis</p></th>
                        <th><p className="text-white">Aksi</p></th>
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
                              className="btn btn-primary btn-sm btn-prediksi"
                              data-id={song.id_song}
                              onClick={() =>{
                                handlePredict(song.id_song);
                                document
                                  .getElementById(`modal_prediksi_${song.id_song}`)
                                  .showModal()
                                }
                              }
                            >
                              Prediksi
                            </button>
                            {/* Modal hasil prediksi */}
                            <dialog id={`modal_prediksi_${song.id_song}`} className="modal">
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
                                          src={song.image}
                                          alt={song.title}
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-md">
                                        {song.title}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <h3 className="font-bold text-3xl text-center p-10 prediction-text">
                                  
                                </h3>
                              </div>
                            </dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrediksiPage;