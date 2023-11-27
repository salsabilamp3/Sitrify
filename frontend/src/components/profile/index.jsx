import React, { useEffect, useState } from "react";

const AvatarProfile = () => {
  const [profile, setProfile] = useState([]);
  useEffect(() => {
    const id = localStorage.getItem("id_artist");
    GetDataUser(id);
  }, []);

  const GetDataUser = async (id_artist) => {
    const response = await fetch(`http://localhost:5000/api/user/profile/${id_artist}`);
    const data = await response.json();
    setProfile(data);
  }

  return (
    <div className="content-end flex">
      <div className="flex justify-between ml-auto">
        <p className="text-white pr-2 pt-2">{profile.name}</p>
        <div className="dropdown dropdown-end">
          <img
            className="w-10 h-10 rounded-full border-2"
            src={profile.image}
            alt=""
            tabIndex={0}
          />
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a href="/">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvatarProfile;
