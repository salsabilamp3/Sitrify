import React, { useEffect } from "react";
import SideBar from "../components/sidebar";
import { DataTable } from "simple-datatables";
import AvatarProfile from "../components/profile";

const PrediksiPage = () => {
  useEffect(() => {});

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
            <div className="card-body p-0 bg-[#453158]">
              <h2 className="card-title pb-2 text-white">Daftar Lagu</h2>
              <div className="bg-white overflow-x-auto ">
                <table cellPadding={0} cellSpacing={0} className="table">
                  {/* head */}
                  <thead>
                    <tr className="text-white">
                      <th>#</th>
                      <th>Judul Lagu</th>
                      <th>Tanggal Rilis</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#453158]">
                    {/* row 1 */}
                    <tr className="text-white">
                      <td>1</td>
                      <td>
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
                            Zemlak, Daniel and Leannon
                            <br />
                            <span className="badge badge-ghost badge-sm">
                              Desktop Support Technician
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>Zemlak, Daniel and Leannon</td>
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

export default PrediksiPage;
