import React from 'react';

function FilterButtons({ filter, setFilter }) {
  return (
    <div className="filters">
      <button 
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        Toutes
      </button>
      <button 
        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
        onClick={() => setFilter('active')}
      >
        À faire
      </button>
      <button 
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}
      >
        Terminées
      </button>
    </div>
  );
}

export default FilterButtons; 