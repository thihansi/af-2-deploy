import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchRelatedCountries } from "../../services/api";

const RelatedCountries = ({ countryName }) => {
  const [relatedCountries, setRelatedCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getRelatedCountries = async () => {
      try {
        const data = await fetchRelatedCountries(countryName);
        setRelatedCountries(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getRelatedCountries();
  }, [countryName]);

  if (loading) {
    return <p>Loading related countries...</p>;
  }

  if (error) {
    return <p>Error fetching related countries: {error}</p>;
  }

  return (
    <div>
      <h3 className="text-xl font-bold">Related Countries</h3>
      <ul className="list-disc pl-5">
        {relatedCountries.map((country) => (
          <li key={country.cca3}>
            <Link
              to={`/countries/${country.cca3}`}
              className="text-blue-600 hover:underline"
            >
              {country.name.common}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedCountries;
