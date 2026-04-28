import { useState, useEffect } from "react";
import { Input } from "./UI";
import { Loader } from "lucide-react";

export default function LocationSearch({ onSelect, validate }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=rw&limit=5`,
        );

        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    const delay = setTimeout(fetchLocations, 400); // debounce
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location..."
      />

      {loading && (
        <Loader
          size="20"
          className="text-surface-500 text-xs animate-spin absolute right-3 top-3.5"
        />
      )}

      {results.length > 0 && (
        <div className="absolute bg-surface-50 border w-full mt-1 rounded shadow z-10">
          {results.map((place) => (
            <div
              key={place.place_id}
              onClick={() => {
                onSelect({
                  label:"Work",
                  address: place.display_name,
                  coordinates: {
                    lat: parseFloat(place.lat),
                    lng: parseFloat(place.lon),
                  },
                });
                setQuery(place.display_name);
                setResults([]);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-black"
            >
              {place.display_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
