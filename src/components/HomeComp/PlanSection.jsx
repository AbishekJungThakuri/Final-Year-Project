import React from 'react';
import { PlanCard } from './PlanCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import Pagination from './Pagination';

const PlansSection = ({
  title,
  count,
  plans = [],
  currentPage = 1,
  totalPages = 1,
  isLoading = false,
  onPlanClick,
  onPageChange,
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'recent',
  onCategoryChange,
  showFilter = false,
  showSearch = false,
  emptyStateProps = {},
  skeletonCount = 6,
  gridCols = "md:grid-cols-2 lg:grid-cols-3"
}) => {
  
  if (isLoading) {
    return (
      <div>
        <SectionHeader 
          title={title}
          count={count}
          showFilter={showFilter}
          showSearch={showSearch}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          isLoading={true}
        />
        <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
          {[...Array(skeletonCount)].map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!Array.isArray(plans) || plans.length === 0) {
    return (
      <div>
        <SectionHeader 
          title={title}
          count={0}
          showFilter={showFilter}
          showSearch={showSearch}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        <EmptyState {...emptyStateProps} searchQuery={searchQuery} />
      </div>
    );
  }

  return (
    <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
      <SectionHeader 
        title={title}
        count={count}
        showFilter={showFilter}
        showSearch={showSearch}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <div className={`grid grid-cols-1 ${gridCols} gap-6 mb-8`}>
        {plans.map((plan, index) => (
          <div 
            key={plan.id}
            className="opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <PlanCard
              plan={plan}
              onClick={() => onPlanClick(plan.id)}
            />
          </div>
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PlansSection;