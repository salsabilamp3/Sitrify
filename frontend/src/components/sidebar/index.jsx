import React from "react";
import { useNavigate, useParams, useMatch } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoBarChartSharp } from "react-icons/io5";
import { FiTrendingUp } from "react-icons/fi";
import { BiListUl } from "react-icons/bi";
import AvatarProfile from "../profile";

const SideBar = ({ page }) => {
  const navigate = useNavigate();
  const prediksiMatch = useMatch(`/prediksi`);
  const chartsMatch = useMatch(`/charts`);
  const daftarArtisMatch = useMatch(`/daftar-artis`);

  return (
    <div className="h-screen w-screen flex flex-nowrap">
      <div className="z-10 p-3 pr-6 w-full fixed">
        <div className="flex-none">
          <AvatarProfile />
        </div>
      </div>

      <div className="w-0 h-full bg-[#29163A] text-white flex flex-col justify-between relative transition-all lg:w-[16rem] lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex items-center justify-center">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <FiMenu />
          </label>
        </div>
        <div className="drawer-side" style={{ backgroundColor: "#29163A" }}>
          <label
            htmlFor="my-drawer-2"
            aria-label="close SideBar2"
            className="drawer-overlay"
          ></label>
          <ul className="menu w-50  text-base-content">
            <li className="mb-2">
              <img src="/image/logo.svg" alt="" />
            </li>
            <li
              className="mb-2 text-base"
              style={
                prediksiMatch
                  ? { backgroundColor: "#453158", color: "#fff" }
                  : { color: "#ffffff" }
              }
            >
              <a
                href="/prediksi"
                style={prediksiMatch ? { color: "#fff" } : { color: "#ffffff" }}
              >
                <FiTrendingUp />
                Prediksi Lagu
              </a>
            </li>

            <li
              className="mb-2 text-base"
              style={
                chartsMatch
                  ? { backgroundColor: "#453158", color: "#fff" }
                  : { color: "#ffffff" }
              }
            >
              <a
                href="/charts"
                style={chartsMatch ? { color: "#fff" } : { color: "#ffffff" }}
              >
                <IoBarChartSharp />
                Charts
              </a>
            </li>
            <li
              className="mb-2 text-base"
              style={
                daftarArtisMatch
                  ? { backgroundColor: "#453158", color: "#fff" }
                  : { color: "#ffffff" }
              }
            >
              <a
                href="/daftar-artis"
                style={
                  daftarArtisMatch ? { color: "#fff" } : { color: "#ffffff" }
                }
              >
                <BiListUl />
                Daftar Artis
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full flex-1 overflow-hidden ">
        <div className="h-full overflow-y-auto pt-10 bg-[#593879]">{page}</div>
      </div>
    </div>
  );
};

export default SideBar;
