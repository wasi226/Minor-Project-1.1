import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import PlantCard from '../components/plant/PlantCard';
import SearchFilters, { SearchFilters as Filters } from '../components/search/SearchFilters';
import { Plant } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ExplorePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    systems: [],
    uses: [],
    habitat: [],
  });
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/plants');
        setPlants(response.data);
        setFilteredPlants(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching plants:', error);
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);
  
  useEffect(() => {
    // Apply search and filters
    let results = plants;
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        plant =>
          plant.commonName.toLowerCase().includes(term) ||
          plant.botanicalName.toLowerCase().includes(term) ||
          plant.description.toLowerCase().includes(term) ||
          plant.uses.some(use => use.toLowerCase().includes(term)) ||
          plant.ayushSystem.some(system => system.toLowerCase().includes(term))
      );
    }
    
    // Apply system filters
    if (filters.systems.length > 0) {
      results = results.filter(plant =>
        plant.ayushSystem.some(system => filters.systems.includes(system))
      );
    }
    
    // Apply uses filters
    if (filters.uses.length > 0) {
      results = results.filter(plant =>
        plant.uses.some(use => 
          filters.uses.some(filterUse => 
            use.toLowerCase().includes(filterUse.toLowerCase())
          )
        )
      );
    }
    
    // Apply habitat filters
    if (filters.habitat.length > 0) {
      results = results.filter(plant =>
        filters.habitat.some(habitat =>
          plant.habitat.toLowerCase().includes(habitat.toLowerCase())
        )
      );
    }
    
    setFilteredPlants(results);
  }, [searchTerm, filters, plants]);
  
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };
  
  return (
    <div className="pt-20">
      <div className="bg-primary-700 text-white py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Explore Medicinal Plants
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Discover the diverse world of AYUSH medicinal plants, their properties, uses, and cultivation methods.
            </p>
            
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, property, use, or system..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-300 shadow-lg"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchFilters onFilterChange={handleFilterChange} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 flex justify-between items-center">
          <div className="text-gray-600">
            Found {filteredPlants.length} plants
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredPlants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">No plants found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ systems: [], uses: [], habitat: [] });
              }}
              className="btn btn-primary"
            >
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPlants.map((plant, index) => (
              <PlantCard key={plant.id} plant={plant} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;