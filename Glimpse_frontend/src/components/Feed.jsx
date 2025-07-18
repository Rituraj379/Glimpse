import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { sanityClient } from '../Client'; 
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data'; 


const MAX_PINS = 200;
function Feed() {
  console.log('Feed render');
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);
  const { categoryId } = useParams();

  // Memoized fetch function to prevent memory leaks
  const fetchData = useCallback(async () => {
    console.log('Feed fetchData called, categoryId:', categoryId);
    try {
      setLoading(true);
      // Use pagination by limiting the results to 50 at a time
      const query = categoryId ? 
        searchQuery(categoryId) + " [0...50]" : 
        feedQuery + " [0...50]";
      console.log('Feed fetch query:', query);
      const data = await sanityClient.fetch(query);
      console.log('Feed fetched data:', data);
      setPins(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    console.log('Feed useEffect triggered');
    // Clean up controller for aborting fetch on component unmount
    const controller = new AbortController();
    fetchData();
    return () => {
      controller.abort();
    };
  }, [fetchData]);

  if (loading) {
    console.log('Feed loading...');
    return <Spinner message="We are adding new ideas to your feed!" />;
  }
  if (!pins?.length) {
    console.log('Feed: No pins available');
    return <h2 className="text-center text-2xl font-bold mt-10">No Pins Available</h2>;
  }
  // MasonryLayout temporarily removed for debugging
  console.log('Feed: would render MasonryLayout with pins:', pins);
  return (
    <div style={{color: 'red', fontWeight: 'bold'}}>Test: Pins loaded ({pins.length})</div>
  );
}

export default Feed;
