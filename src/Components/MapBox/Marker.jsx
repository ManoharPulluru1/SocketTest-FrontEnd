import React from "react";

const Marker = ({ userName, userImage }) => {
  return (
    <div className="marker">
      <img src={userImage} alt="User Icon" />
      <span>{userName}</span>
    </div>
  );
};

export default Marker;
