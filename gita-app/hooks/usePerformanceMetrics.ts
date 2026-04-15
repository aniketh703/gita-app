/**
 * Performance monitoring hook
 * Tracks component mount/unmount times and initial render duration
 * Useful for identifying performance bottlenecks during optimization
 */

import { useEffect, useRef } from 'react';

/**
 * Hook to measure and log component performance metrics
 * @param screenName - Name of the screen/component being measured
 * @param enabled - Whether to enable performance tracking (default: __DEV__)
 */
export function usePerformanceMetrics(
  screenName: string, 
  enabled: boolean = typeof __DEV__ !== 'undefined' ? __DEV__ : true
) {
  const startTimeRef = useRef(Date.now());
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const duration = Date.now() - startTimeRef.current;
    const startTime = startTimeRef.current; // Capture for cleanup
    
    if (!mountedRef.current) {
      // First render
      console.log(`[PERF] ${screenName} initial render: ${duration}ms`);
      mountedRef.current = true;
    }

    return () => {
      const totalTime = Date.now() - startTime;
      console.log(`[PERF] ${screenName} unmounted after ${totalTime}ms`);
    };
  }, [screenName, enabled]);

  /**
   * Manual performance marker for specific operations
   */
  const mark = (label: string) => {
    if (enabled) {
      const elapsed = Date.now() - startTimeRef.current;
      console.log(`[PERF] ${screenName} - ${label}: ${elapsed}ms`);
    }
  };

  return { mark };
}

/**
 * Higher-order function to measure async operation performance
 * @param operation - The async function to measure
 * @param label - Label for the operation
 * @returns Wrapped async function that logs performance
 */
export function measureAsync<T extends (...args: any[]) => Promise<any>>(
  operation: T,
  label: string
): T {
  return (async (...args: Parameters<T>) => {
    const start = Date.now();
    try {
      const result = await operation(...args);
      const duration = Date.now() - start;
      console.log(`[PERF] ${label}: ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.log(`[PERF] ${label} (failed): ${duration}ms`);
      throw error;
    }
  }) as T;
}

/**
 * Simple performance timer utility
 */
export class PerformanceTimer {
  private startTime: number;
  
  constructor(private label: string) {
    this.startTime = Date.now();
  }

  end() {
    const duration = Date.now() - this.startTime;
    console.log(`[PERF] ${this.label}: ${duration}ms`);
    return duration;
  }

  lap(lapLabel: string) {
    const duration = Date.now() - this.startTime;
    console.log(`[PERF] ${this.label} - ${lapLabel}: ${duration}ms`);
    return duration;
  }
}
