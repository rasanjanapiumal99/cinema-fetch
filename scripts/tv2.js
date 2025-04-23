const axios = require('axios');

async function fetchData(url) {
  const response = await axios.get(url);
  return response.data;
}

async function insertData(data) {
  const response = await axios.post('https://api.skymansion.site/tv2/insert.php', data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}

async function execute() {
  try {
    console.log('Starting TV2 script execution...');
    
    // Fetch years
    const years = await fetchData('https://api.skymansion.site/tv2/yyyy.php');
    const totalYears = years.length;
    let processedYears = 0;

    for (const year of years) {
      processedYears++;
      console.log(`Processing year: ${year} (${processedYears}/${totalYears})`);

      // Fetch paths for each year
      const paths = await fetchData(`https://api.skymansion.site/tv2/path.php?y=${year}`);
      for (const path of paths) {
        // Fetch seasons for each path
        const seasons = await fetchData(`https://api.skymansion.site/tv2/s.php?y=${year}&p=${path}`);
        for (const season of seasons) {
          // Fetch movies for each season
          const movies = await fetchData(`https://api.skymansion.site/tv2/name.php?y=${year}&p=${path}&s=${season}`);
          for (const movie of movies) {
            // Prepare data for insertion
            const data = {
              year: year,
              path: path,
              season: season,
              episode: movie.episodeNumber,
              name: movie.episode,
              size: movie.size
            };

            // Insert data into the database
            const result = await insertData(data);
            if (result.status === 'success') {
              console.log(`Inserted: ${movie.episode} (Season ${season})`);
            } else {
              console.error(`Error inserting: ${movie.episode} (Season ${season})`);
            }
          }
        }
      }
    }

    console.log('TV2 script execution completed successfully');
  } catch (error) {
    console.error('Error in TV2 script:', error.message);
    throw error;
  }
}

module.exports = { execute };
