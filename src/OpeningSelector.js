// src/OpeningSelector.js

import React, { useEffect, useState } from 'react';
import WebSocketInstance from './WebSocketService';

const OpeningSelector = () => {
  const [openings, setOpenings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Register the callback for 'openingList' messages
    WebSocketInstance.addCallback('openingList', handleOpeningList);

    // Request the list of openings when the component mounts
    WebSocketInstance.sendMessage({ type: 'getOpenings' });

    // Cleanup function (if needed)
    return () => {
      // If you have cleanup code, it can go here
    };
  }, []);

  const handleOpeningList = (data) => {
    console.log('Received openings list:', data);
    setOpenings(data.names); // Assuming `data.names` is the array of opening names
  };

  const handleSelectionChange = (event) => {
    const selectedOpening = event.target.value;
    WebSocketInstance.sendMessage({ type: 'selectOpening', data: selectedOpening });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter the openings based on the search query
  const filteredOpenings = openings.filter(opening =>
    opening.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search for an opening..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px' }}
      />
      <select onChange={handleSelectionChange} size={5}>
        {filteredOpenings.length === 0 ? (
          <option disabled>No openings found</option>
        ) : (
          filteredOpenings.slice(0, 5).map((opening, index) => (
            <option key={index} value={opening}>{opening}</option>
          ))
        )}
      </select>
    </div>
  );
};

export default OpeningSelector;

