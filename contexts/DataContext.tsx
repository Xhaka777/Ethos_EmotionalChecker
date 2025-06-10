// contexts/DataContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type MoodEntry = {
  id: string;
  date: string;
  mood: {
    id: string;
    emoji: string;
    label: string;
    color: string;
  };
  journalEntry?: string;
  timestamp: number;
};

type DataContextType = {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  updateEntry: (id: string, updates: Partial<MoodEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByDateRange: (startDate: Date, endDate: Date) => MoodEntry[];
  getTodaysEntry: () => MoodEntry | undefined;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  // Initialize with some sample data for demo purposes
  useEffect(() => {
    const sampleEntries: MoodEntry[] = [
      {
        id: 'sample-1',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
        mood: { id: '1', emoji: '😊', label: 'Happy', color: '#10B981' },
        journalEntry: 'Had a wonderful day at work! Everything went smoothly and I felt really productive.',
        timestamp: Date.now() - 86400000,
      },
      {
        id: 'sample-2',
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
        mood: { id: '2', emoji: '😌', label: 'Calm', color: '#3B82F6' },
        journalEntry: 'Spent the evening reading and relaxing. Feeling very peaceful.',
        timestamp: Date.now() - 172800000,
      },
      {
        id: 'sample-3',
        date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
        mood: { id: '4', emoji: '😤', label: 'Stressed', color: '#F59E0B' },
        journalEntry: 'Deadlines are piling up. Need to take some time to organize my priorities.',
        timestamp: Date.now() - 259200000,
      },
    ];
    setEntries(sampleEntries);
  }, []);

  const addEntry = (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
  };

  const updateEntry = (id: string, updates: Partial<MoodEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntriesByDateRange = (startDate: Date, endDate: Date): MoodEntry[] => {
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const getTodaysEntry = (): MoodEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return entries.find(entry => entry.date === today);
  };

  return (
    <DataContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntriesByDateRange,
      getTodaysEntry,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}