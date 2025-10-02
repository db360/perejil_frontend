import { useCompleteMenu } from "../hooks/useMenu";
import LoadingAnim from "./layout/LoadingAnim";

export default function Menu() {
  const { completeMenu, loading, error } = useCompleteMenu();

  console.log(completeMenu);
  return (
    <div className="p-4 max-w-10/12 mx-auto">
      <LoadingAnim loading={loading} />
      {error && <p>Error: {error}</p>}
      <h1 className="text-3xl bold text-center font-bold">Nuestro Menú</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {completeMenu[0]?.sections.map((sectionData) => (
          <div key={sectionData.section.id}>
            <h2 className="pl-2 font-bold">{sectionData.section.name}</h2>
            {sectionData.products.map((product) => (
              <div key={product.id}>
                <h3 className="pl-4">{product.title.rendered}</h3>
                <p>{product.meta?.precio}</p>
                <img className="w-24 h-16 object-cover" src={product.imageUrl} alt={product.title.rendered} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
