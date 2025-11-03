import { useState } from "react";
import { Search, X } from "lucide-react";

function SearchUser({ onSearch }) {
  const [word, setWord] = useState("");

  const handleSearch = () => {
    if (word.trim() !== "") {
      onSearch(word);
    } else {
      onSearch("");
    }
  };

  const handleClear = () => {
    setWord("");
    onSearch("");
  };

  return (
    <div className="flex gap-3 items-center">
      <input
      type="text"
      className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-2 rounded-lg w-72 transition-all duration-200 outline-none text-gray-700 bg-gray-50"
      placeholder="Buscar usuario..."
      value={word}
      onChange={(e) => setWord(e.target.value)}
      />
      <button
      onClick={handleSearch}
      className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition-all duration-200"
      >
      <Search size={18} />
      Buscar
      </button>
      <button
      onClick={handleClear}
      className="flex items-center gap-2 px-5 py-2 bg-gray-500 text-white rounded-full font-semibold shadow hover:bg-gray-600 transition-all duration-200"
      >
      <X size={18} />
      Limpiar
      </button>
    </div>
  );
}

export default SearchUser;
