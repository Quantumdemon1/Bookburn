import React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  setValue: (value: string) => void;
}>({
  value: '',
  setValue: () => {},
});

export const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = '' }: TabsTriggerProps) => {
  const { value: selectedValue, setValue } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 rounded-md transition-colors ${
        isSelected
          ? 'bg-[#FF1B4C] text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children }: TabsContentProps) => {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (value !== selectedValue) return null;

  return <div>{children}</div>;
};