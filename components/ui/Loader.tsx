// components/Loader.js
"use client"
import { useCustomHook } from "./LoaderContext";

const Loader = () => {

const { loaderActive }: any = useCustomHook();

  return (
    <div className={`${loaderActive === false ? "hidden": "grid"} place-items-center fixed top-0 left-0 w-screen h-screen bg-dark-4/90 z-50`}>
      <div className="custom-loader"></div>
    </div>
  );
};

export default Loader;
