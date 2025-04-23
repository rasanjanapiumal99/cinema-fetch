const axios = require('axios');

async function fetchData(url) {
  const response = await axios.get(url);
  return response.data;
}

async function insertData(data) {
  const response = await axios.post('https://api.skymansion.site/mv2/insert.php', data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

async function execute() {
  try {
    console.log('Starting MV2 script execution...');
    
    // Fetch years
    const years = await fetchData('https://api.skymansion.site/mv2/yyyy.php');
    const totalYears = years.length;
    let processedYears = 0;

    for (const year of years) {
      processedYears++;
      console.log(`Processing year: ${year} (${processedYears}/${totalYears})`);

      // Fetch paths for each year
      const paths = await fetchData(`https://api.skymansion.site/mv2/path.php?y=${year}`);
      for (const path of paths) {
        // Fetch movies for each path
        const movies = await fetchData(`https://api.skymansion.site/mv2/name.php?y=${year}&p=${path}`);
        for (const movie of movies) {
          // Prepare data for insertion
          const data = {
            year: year,
            path: path,
            name: movie.movie,
            size: movie.size
          };

          // Insert data into the database
          const result = await insertData(data);
          if (result.status === 'success') {
            console.log(`Inserted: ${movie.movie}`);
          } else {
            console.error(`Error inserting: ${movie.movie}`);
          }
        }
      }
    }

    console.log('MV2 script execution completed successfully');
  } catch (error) {
    console.error('Error in MV2 script:', error.message);
    throw error;
  }
}

module.exports = { execute };
