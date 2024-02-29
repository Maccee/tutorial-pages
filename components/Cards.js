// Map all markers to a component using grid layout.
export const Cards = ({ markers, setSelectedCard }) => {
  const totalCards = markers?.length;
  return (
    <>
      <section className="relative">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 " style={{ paddingLeft: '15px', paddingRight: '15px', paddingBottom: '10px', paddingTop: '15px' }}>
          {markers?.map((item) => (
            <div
              className="relative bg-cover bg-center bg-no-repeat shadow-lg border-gray-200 p-4 rounded-3xl h-56 transition duration-300 transform hover:scale-105 active:scale-100"
              style={{
                backgroundImage: `url(${item.imageUrl})`,
                transition: 'transform 300ms ease-in-out, box-shadow 300ms ease-in-out',
              }}
              onClick={() => setSelectedCard(item.coordinates)}
              key={item.id}
            >
              <div className="absolute flex inset-0 flex-col justify-end p-4 bg-opacity-50 bg-slate-900 rounded-3xl">
                <p className="text-lg xl:text-3xl font-semibold text-white">
                  {item.name}
                </p>
                <p className="text-sm text-white">{item.description}</p>
                <p>
                  <a
                    href={item.www}
                    className="text-decoration-none text-gray-400 word-wrap"
                    target="_blank"
                    rel="noopener noreferrer"
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
