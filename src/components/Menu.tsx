import { BounceLoader } from "react-spinners";
import { useCompleteMenu } from "../hooks/useMenu";

export default function Menu() {
  const { completeMenu, loading, error } = useCompleteMenu();

  console.log(completeMenu);
  return (
    <div>
      {loading && (
        <div>
          <p>Cargando menú...</p>
          <BounceLoader color="#4ade80" />
        </div>
      )}
      {error && <p>Error: {error}</p>}
      <h1 className="text-xl font-bold">Menu</h1>
      <div>
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
