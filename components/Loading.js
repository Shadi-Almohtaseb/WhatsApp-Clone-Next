import { CogIcon } from "@heroicons/react/outline";
import React from "react";

const Loding = () => {
  return (
    <div className="grid place-items-center h-screen">
      <div className="flex items-center justify-center flex-col">
        <CogIcon hanging={100} width={100} className="animate-spin" /> Loding...
      </div>
    </div>
  );
};

export default Loding;
