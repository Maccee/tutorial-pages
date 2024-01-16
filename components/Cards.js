import React from "react";

export const Cards = ({ markers }) => {
  const totalCards = markers.length;
  return (
    <>
      <section className="w-[60%]">
        <h2 className="">Results - {totalCards}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {markers?.map((item) => (
    <div
      className="relative bg-cover bg-center bg-no-repeat overflow-hidden border-gray-200 p-4 rounded-lg shadow-md h-56"
      style={{
        backgroundImage: `url(${item.imageUrl})`,
        backgroundOpacity: "0.7",
        backgroundColor: "rgba(0,0,0,0.2)",
      }}
      key={item.id}
    >
      <div className="absolute inset-0 flex flex-col justify-end p-4 bg-opacity-50 bg-slate-900">
        <p className="text-lg xl:text-3xl font-semibold text-white">{item.name}</p>
        <p className="text-sm text-white">{item.description}</p>
      </div>
    </div>
  ))}
</div>

      </section>
    </>
  );
};
