import Navbar from "./components/Navbar";
import { CommandIcon, Rows, Search as SearchIcon } from "lucide-react";
function App() {
  const PRODUCTS = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
  ];

  return (
    <>
      <header>{/* <Navbar></Navbar>{" "} */}</header>

      <main className="max-w-[1440px] w-11/12 mx-auto py-6">
        <FilterAbleProductsTable products={PRODUCTS}></FilterAbleProductsTable>
      </main>

      <></>
    </>
  );
}

const FilterAbleProductsTable = ({ products }) => {
  return (
    <div>
      <SearchBar></SearchBar>
      <ProductTable products={products}></ProductTable>
    </div>
  );
};

const SearchBar = () => {
  return (
    <div className="relative space-y-4 p-px rounded-2xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 shadow-lg shadow-purple-500/20 dark:shadow-purple-600/30 transition-shadow duration-300 hover:shadow-purple-500/40 dark:hover:shadow-purple-600/50 focus-within:shadow-purple-500/40 dark:focus-within:shadow-purple-600/50">
      <div className="flex items-center w-full px-4 py-2 bg-white/80 dark:bg-gray-900/90 rounded-[15px]">
        <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search fruits by name.."
          className="w-full px-3 py-1 text-lg text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent focus:outline-none flex-1 min-w-0"
        />
      </div>
      <label>
        <input type="checkbox" /> Only show products in stock
      </label>
    </div>
  );
};

const ProductTable = ({ products }) => {
  let lastCategory = null;
  const rows = [];
  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        ></ProductCategoryRow>
      );
    }
    rows.push(<ProductRow product={product} key={product.name}></ProductRow>);
    lastCategory = product.category;
  });

  return (
    <table className="table-auto border-collapse border border-gray-400">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

const ProductCategoryRow = ({ category }) => {
  return (
    <tr>
      <th colSpan={2}>{category}</th>
    </tr>
  );
};

const ProductRow = ({ product }) => {
  const name = product?.stocked ? <span style={{color: 'green'}}>{product?.name}</span> : 
  <span style={{color: `red`}}>{product?.name}</span>
  return (
    <tr>
      <td>{name}</td>
    </tr>
  );
};

export default App;
