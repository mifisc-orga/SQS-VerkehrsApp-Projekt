import { useState, useEffect, useRef } from 'react';
import { fetchAvailableRoads } from '../services/trafficService';

/** Return type of the useAutobahnSelector hook */
export interface UseAutobahnSelectorResult {
  /** List of all available motorway identifiers */
  roads: string[];
  /** Whether the dropdown is currently open */
  isOpen: boolean;
  /** Opens or closes the dropdown */
  setIsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  /** Error message if roads failed to load, or null */
  error: string | null;
  /** Ref to attach to the wrapper element for click-outside detection */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /** Toggles a motorway in the selection */
  toggle: (road: string) => void;
  /** Removes a motorway from the selection */
  remove: (road: string) => void;
}

/**
 * Manages state and side effects for the AutobahnSelector component.
 * Handles road fetching, dropdown open/close, click-outside detection,
 * and motorway toggle/remove logic.
 */
export function useAutobahnSelector(
  selected: string[],
  onSelect: (roadIds: string[]) => void,
  max: number,
): UseAutobahnSelectorResult {
  const [roads, setRoads] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAvailableRoads()
      .then(setRoads)
      .catch(() => setError('Autobahnen konnten nicht geladen werden.'));
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggle(road: string) {
    let next: string[];
    if (selected.includes(road)) {
      next = selected.filter(r => r !== road);
    } else if (selected.length < max) {
      next = [...selected, road];
    } else {
      return;
    }
    onSelect(next);
  }

  function remove(road: string) {
    onSelect(selected.filter(r => r !== road));
  }

  return { roads, isOpen, setIsOpen, error, wrapperRef, toggle, remove };
}