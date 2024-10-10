import React, { useState, useMemo } from 'react';
import { FengShuiData, Category, Formation } from '../types';

interface LookupProps {
  data: Record<Category, FengShuiData[]>;
}

const Lookup: React.FC<LookupProps> = ({ data }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItem, setSelectedItem] = useState<FengShuiData | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const groupedCachCuc = useMemo(() => {
    if (selectedCategory !== 'CáchCục') return null;
    
    const grouped: Record<string, Formation[]> = {};
    data.CáchCục.forEach((item) => {
      const firstWord = (item as Formation).components.split('/')[0];
      if (!grouped[firstWord]) {
        grouped[firstWord] = [];
      }
      grouped[firstWord].push(item as Formation);
    });
    return grouped;
  }, [data, selectedCategory]);

  const renderDetails = (item: FengShuiData) => {
    if ('yinYang' in item) {
      return (
        <>
          <p><strong>Âm/Dương:</strong> {item.yinYang}</p>
          <p><strong>Ngũ hành:</strong> {item.elementType}</p>
          <p><strong>Đặc tính:</strong> {item.characteristics}</p>
          <p><strong>Ứng dụng:</strong> {item.applications}</p>
        </>
      );
    } else if ('components' in item) {
      return (
        <>
          <p><strong>Thành phần:</strong> {item.components}</p>
          <p><strong>Ý nghĩa:</strong> {item.meaning}</p>
          <p><strong>Cát/Hung:</strong> {item.auspiciousness}</p>
          <p><strong>Ứng dụng:</strong> {item.applications}</p>
        </>
      );
    } else {
      return (
        <>
          <p><strong>Ngũ hành:</strong> {item.elementType}</p>
          <p><strong>Đặc tính:</strong> {item.characteristics}</p>
          <p><strong>Ứng dụng:</strong> {item.applications}</p>
        </>
      );
    }
  };

  const renderItemName = (item: FengShuiData) => {
    if ('components' in item) {
      return (item as Formation).components;
    }
    return item.name;
  };

  const renderCachCucGroups = () => {
    if (!groupedCachCuc) return null;

    return Object.entries(groupedCachCuc).map(([group, items]) => (
      <div key={group} className="mb-2">
        <button
          className="w-full text-left px-4 py-2 bg-amber-200 hover:bg-amber-300 rounded"
          onClick={() => setExpandedGroup(expandedGroup === group ? null : group)}
        >
          {group}
        </button>
        {expandedGroup === group && (
          <div className="pl-4 mt-2 space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                className={`w-full text-left px-4 py-2 rounded ${
                  selectedItem === item ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                {item.components}
              </button>
            ))}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-amber-800">Tra cứu</h2>
      <div className="flex space-x-4 mb-4">
        {Object.keys(data).map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded ${
              selectedCategory === category ? 'bg-amber-600 text-white' : 'bg-amber-200'
            }`}
            onClick={() => {
              setSelectedCategory(category as Category);
              setSelectedItem(null);
              setExpandedGroup(null);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="flex">
        <div className="w-1/3 pr-4">
          {selectedCategory === 'CáchCục' ? (
            renderCachCucGroups()
          ) : (
            selectedCategory && (
              <div className="grid grid-cols-2 gap-2">
                {data[selectedCategory].map((item) => (
                  <button
                    key={item.id}
                    className={`p-2 rounded ${
                      selectedItem === item ? 'bg-amber-300' : 'bg-amber-100 hover:bg-amber-200'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {renderItemName(item)}
                  </button>
                ))}
              </div>
            )
          )}
        </div>
        <div className="w-2/3">
          {selectedItem && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-bold mb-2 text-amber-700">{selectedItem.name}</h3>
              {renderDetails(selectedItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lookup;