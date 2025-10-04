"use client"

import * as React from "react"

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className, children }) => {
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, onValueChange, className, children }) => {
  const isActive = React.useContext(TabsContext) === value;
  
  return (
    <button 
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all 
        ${isActive 
          ? "bg-white text-gray-950 shadow-sm" 
          : "text-gray-500 hover:text-gray-700"
        } ${className}`}
      onClick={() => onValueChange?.(value)}
      type="button"
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

// Create a context to track the active tab value
const TabsContext = React.createContext<string>("");

const TabsContent: React.FC<TabsContentProps> = ({ value, className, children }) => {
  const activeValue = React.useContext(TabsContext);
  
  if (activeValue !== value) {
    return null;
  }
  
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
};

// Provider component to set the context value
interface TabsProviderProps {
  value: string;
  children: React.ReactNode;
}

const TabsProvider: React.FC<TabsProviderProps> = ({ value, children }) => {
  return (
    <TabsContext.Provider value={value}>
      {children}
    </TabsContext.Provider>
  );
};

// Wrap the Tabs component to provide the context
const TabsWithProvider: React.FC<TabsProps> = (props) => {
  return (
    <TabsProvider value={props.value}>
      <Tabs {...props} />
    </TabsProvider>
  );
};

export { TabsWithProvider as Tabs, TabsList, TabsTrigger, TabsContent };
