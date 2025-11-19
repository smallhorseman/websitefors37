import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for debounced updates in Visual Editor property components.
 * Prevents focus loss by maintaining local state and debouncing parent updates.
 * 
 * @param initialData - Initial data from parent component
 * @param onUpdate - Callback to update parent component
 * @param delay - Debounce delay in milliseconds (default: 300)
 * @param deps - Dependencies that trigger local state sync (optional)
 * @returns [localData, handleUpdate] tuple
 * 
 * @example
 * ```tsx
 * function MyProperties({ data, onUpdate }) {
 *   const [localData, handleUpdate] = useDebouncedUpdate(data, onUpdate);
 *   
 *   return (
 *     <input
 *       value={localData.title}
 *       onChange={(e) => handleUpdate({ title: e.target.value })}
 *     />
 *   );
 * }
 * ```
 */
export function useDebouncedUpdate<T extends Record<string, any>>(
  initialData: T,
  onUpdate: (data: Partial<T>) => void,
  delay: number = 300,
  deps?: any[]
) {
  const [localData, setLocalData] = useState<T>(initialData);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  // Sync local state when specified dependencies change
  useEffect(() => {
    setLocalData(initialData);
  }, deps || [initialData]);

  // Debounced update handler
  const handleUpdate = useCallback((updates: Partial<T>) => {
    const newData = { ...localData, ...updates };
    
    // Update local state immediately for responsive UI
    setLocalData(newData);
    
    // Debounce parent update to prevent re-renders
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      onUpdate(newData);
    }, delay);
  }, [localData, onUpdate, delay]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return [localData, handleUpdate] as const;
}
