import React, { useState, useEffect } from 'react';
import Lookup from './components/Lookup';
import DataEntry from './components/DataEntry';
import DataManagement from './components/DataManagement';
import { FengShuiData, Category } from './types';
import { Compass, Upload, Download, RefreshCw } from 'lucide-react';
import databaseData from './database.json';

function App() {
  const [data, setData] = useState<Record<Category, FengShuiData[]>>(() => {
    const savedData = localStorage.getItem('fengShuiData');
    return savedData ? JSON.parse(savedData) : databaseData;
  });
  const [activeTab, setActiveTab] = useState<'lookup' | 'dataEntry' | 'dataManagement'>('lookup');

  useEffect(() => {
    localStorage.setItem('fengShuiData', JSON.stringify(data));
  }, [data]);

  const handleSave = (category: Category, newData: FengShuiData) => {
    setData(prevData => ({
      ...prevData,
      [category]: [...prevData[category], newData],
    }));
  };

  const handleEdit = (category: Category, id: string, updatedData: FengShuiData) => {
    setData(prevData => ({
      ...prevData,
      [category]: prevData[category].map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
      ),
    }));
  };

  const handleDelete = (category: Category, id: string) => {
    setData(prevData => ({
      ...prevData,
      [category]: prevData[category].filter((item) => item.id !== id),
    }));
  };

  const handleResetData = () => {
    setData(databaseData);
    localStorage.setItem('fengShuiData', JSON.stringify(databaseData));
    alert('Dữ liệu đã được đặt lại về mặc định!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setData(importedData);
          localStorage.setItem('fengShuiData', JSON.stringify(importedData));
          alert('Dữ liệu đã được nhập thành công!');
        } catch (error) {
          alert('Có lỗi xảy ra khi nhập dữ liệu. Vui lòng kiểm tra file và thử lại.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'feng_shui_data.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-700 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Compass className="mr-2" size={24} />
            <h1 className="text-2xl font-bold">Hệ thống Tham khảo Phong thủy</h1>
          </div>
          <div className="flex items-center">
            <label htmlFor="import-data" className="cursor-pointer flex items-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded mr-2">
              <Upload size={20} className="mr-2" />
              Nhập dữ liệu
            </label>
            <input
              id="import-data"
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
            <button
              onClick={handleExportData}
              className="flex items-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded mr-2"
            >
              <Download size={20} className="mr-2" />
              Xuất dữ liệu
            </button>
            <button
              onClick={handleResetData}
              className="flex items-center bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded"
            >
              <RefreshCw size={20} className="mr-2" />
              Đặt lại dữ liệu
            </button>
          </div>
        </div>
      </header>
      <nav className="bg-amber-600 text-white">
        <div className="container mx-auto flex">
          <button
            className={`px-4 py-2 ${activeTab === 'lookup' ? 'bg-amber-700' : ''}`}
            onClick={() => setActiveTab('lookup')}
          >
            Tra cứu
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'dataEntry' ? 'bg-amber-700' : ''}`}
            onClick={() => setActiveTab('dataEntry')}
          >
            Nhập dữ liệu
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'dataManagement' ? 'bg-amber-700' : ''}`}
            onClick={() => setActiveTab('dataManagement')}
          >
            Quản lý dữ liệu
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-8">
        {activeTab === 'lookup' && <Lookup data={data} />}
        {activeTab === 'dataEntry' && <DataEntry onSave={handleSave} />}
        {activeTab === 'dataManagement' && (
          <DataManagement data={data} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}

export default App;