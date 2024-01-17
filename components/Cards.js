import React from "react";

export const Cards = ({ markers, setSelectedCard }) => {
  const totalCards = markers?.length;
  return (
    <>
      <section className="w-[60%]">
        <h2 className="">Results - {totalCards}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {markers?.map((item) => (
            <div
              className="relative bg-cover bg-center bg-no-repeat shadow-lg border-gray-200 p-4 rounded-3xl h-56"
              style={{
                backgroundImage: `url(${item.imageUrl})`,
              }}
              onClick={() => setSelectedCard(item.coordinates)}
              key={item.id}
            >
              <div className="absolute flex inset-0 flex-col justify-end p-4 bg-opacity-50 bg-slate-900 rounded-3xl">
                <p className="text-lg xl:text-3xl font-semibold text-white">
                  {item.name} {item.id}
                </p>
                <p className="text-sm text-white">{item.description}</p>
                <p>
                  <a
                    href={item.www}
                    className="text-decoration-none text-gray-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.www}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
