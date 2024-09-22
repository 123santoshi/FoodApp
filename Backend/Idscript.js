import fs from 'fs';

// Read the JSON file
fs.readFile('./Rest_data.json', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Parse the JSON data
  let dataObject = JSON.parse(data);
  console.log("Data Object:", dataObject);

  // Function to add item_id to each object in the nested arrays
  const addItemIds = (obj, idCounter = { count: 1 }) => {
    if (Array.isArray(obj)) {
      return obj.map(item => addItemIds(item, idCounter));
    } else if (typeof obj === 'object' && obj !== null) {
      // Add item_id to the objects in the nested array
      if (obj.items && Array.isArray(obj.items)) {
        obj.items = obj.items.map(item => {
          return {
            ...item,
            item_id: `${idCounter.count++}`
          };
        });
      }
      // Recursively process nested objects
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
          addItemIds(obj[key], idCounter);
        }
      });
    }
    return obj;
  };

  // Process the data to add item_id
  dataObject = addItemIds(dataObject);
  
  // Convert the updated object back to a JSON string
  const updatedData = JSON.stringify(dataObject, null, 2);

  // Write the updated data back to the file
  fs.writeFile('./Rest_data.json', updatedData, 'utf-8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log('Item IDs added successfully!');
  });
});
