/**
 * Lazy Load Component
 *
 * Purpose: Prevent incomplete page renders during slow loading
 * Method: Progressive loading with skeleton screens
 *
 * @module LazyLoad
 */

import { Suspense, lazy, ComponentType } from "react";
import "./LazyLoad.css";

interface LazyLoadProps {
  fallback?: React.ReactNode;
}

// Skeleton loader component
export function PageSkeleton() {
  return (
    <div className="page-skeleton">
      <div className="skeleton-header"></div>
      <div className="skeleton-content">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line medium"></div>
      </div>
    </div>
  );
}

// Lazy load wrapper with error boundary
export function lazyLoadPage<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) {
  const LazyComponent = lazy(importFunc);

  return (props: any) => (
    <Suspense fallback={<PageSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}


