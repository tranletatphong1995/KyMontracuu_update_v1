import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, 'src', 'database.json');
const newDataPath = path.join(__dirname, 'new-cach-cuc-data.json');

async function updateDatabase() {
  try {
    // Read current data
    const currentDataRaw = await fs.readFile(databasePath, 'utf8');
    const currentData = JSON.parse(currentDataRaw);

    // Read new data
    const newDataRaw = await fs.readFile(newDataPath, 'utf8');
    const newData = JSON.parse(newDataRaw);

    // Merge data
    const mergedData = {
      ...currentData,
      CáchCục: [...currentData.CáchCục, ...newData.CáchCục]
    };

    // Write merged data back to database.json
    await fs.writeFile(databasePath, JSON.stringify(mergedData, null, 2));

    console.log('Dữ liệu đã được cập nhật thành công!');
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
  }
}

updateDatabase();