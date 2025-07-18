import React, { useState, useEffect } from 'react';
import { sanityClient } from '../Client';
import MasonryLayout from './MasonryLayout';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
import { MdYoutubeSearchedFor } from 'react-icons/md';


const MAX_PINS = 200;
function Search({ searchTerm }) {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ typo fixed: 'flase' → 'false'

  useEffect(() => {
    setLoading(true); // Always start with loading true on any change
    if (searchTerm) {
      const query = searchQuery(searchTerm.toLowerCase()); // ✅ 'tolowerCase' → 'toLowerCase'
      sanityClient.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      sanityClient.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);

  return (
    <div className="px-2 w-full">
      {loading && <Spinner message="Searching for Pins" />}
      {/* MasonryLayout temporarily removed for debugging */}
      {Array.isArray(pins) && pins.length !== 0 && (
        <div style={{color: 'red', fontWeight: 'bold'}}>Test: Pins loaded ({pins.length})</div>
      )}
      {Array.isArray(pins) && pins.length === 0 && searchTerm !== '' && !loading && (
         <div className="mt-10 text-center text-xl">No Pins Found</div>
      )}
    </div>
  );
}

export default Search;
MdYoutubeSearchedFor