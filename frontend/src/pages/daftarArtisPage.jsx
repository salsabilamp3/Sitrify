import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "simple-datatables";

const DaftarArtisPage = () => {
  const [artistData, setArtistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let datatable;

  const GetDataArtist = async () => {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:5000/api/artist/latest`)
        .then(async (resp) => {
          return await resp.json();
        })
        .then(async (item) => {
          console.log(item);
          const tempArr = [];
          for (var i = 0; i < 100; i++) {
            tempArr.push(item[i]);
          }
          setArtistData(tempArr);
        });
    } catch (error) {
      console.error("Error fetching artist data:", error.message);
    }
  };

  useEffect(() => {
    GetDataArtist();
  }, []);

  useEffect(() => {
    if (artistData.length > 0) {
      datatable = new simpleDatatables.DataTable("#myTable", {
        pagination: true,
      });
      datatable.on("datatable.init", () => {
        setIsLoading(false);
        datatable.refresh();
      });
    }
  }, [artistData]);

  return (
    <div className="flex">
      <div className="w-full flex flex-col gap-3 p-5">
        <div className="content-start flex">
          <p className="font-bold text-3xl text-white pl-4 pb-4">
            Daftar Artis
          </p>
        </div>
        <div className="pl-4">
          <div className="card shadow-xl bg-[#453158]">
            <div className="card-body p-0 bg-[#453158]">
              {isLoading && (
                <div className="w-full flex items-center justify-center text-white">
                  <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                  Loading ...
                </div>
              )}
              <div
                className={`bg-[#453158] overflow-x-auto ${
                  isLoading ? "hidden" : ""
                }`}
              >
                <table id="myTable" className="table bg-[#453158]">
                  <thead className="text-white bg-[#29163a] text-sm">
                    <tr>
                      <th>
                        <p className="text-white">#</p>
                      </th>
                      <th>
                        <p className="text-white">Artis</p>
                      </th>
                      <th>
                        <p className="text-white">Pengikut</p>
                      </th>
                      <th>
                        <p className="text-white">Popularitas</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ color: "#453158" }}>
                    {artistData?.map((artist, index) => (
                      <tr className="" key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={artist.image}
                                  alt={`Avatar of ${artist.name}`}
                                />
                              </div>
                            </div>
                            <div>{artist.name}</div>
                          </div>
                        </td>
                        <td>
                          <p>{artist.followers}</p>
                          <span className="text-green-600 text-center">{`+${artist.followers_difference}`}</span>
                        </td>
                        <td>
                          <p>{artist.popularity}</p>
                          {artist.popularity_difference >= 0 ? (
                            <span className="text-green-600">{`+${artist.popularity_difference}`}</span>
                          ): (
                            <span className="text-red-600">{`-${artist.popularity_difference}`}</span>
                          )}
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
  );
};

export default DaftarArtisPage;
