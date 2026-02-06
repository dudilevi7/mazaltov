"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRing } from "@fortawesome/free-solid-svg-icons";

const AppHeader = () => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-1 items-center animate-fade-in-0.5">
        <FontAwesomeIcon
          icon={faRing}
          className="text-gray-300 animate-pulse max-w-8"
          size="2x"
        />
        <h1 className="text-2xl font-bold text-gray-800 rounded-md">MazalTov</h1>
      </div>
    </div>
  );
};

export default AppHeader;
