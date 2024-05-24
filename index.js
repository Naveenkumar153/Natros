const express = require('express');
const app = express();
const fs = require('fs');

const filePath = `${__dirname}/dev-data/data/tours-simple.json`;

try {
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
    const tours = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    app.get('/api/v1/tours', (req, res) => {
      res.status(200).json({
        status: 'success',
        data: {
          tours,
        },
      });
    });
  } else {
    console.error(`${filePath} is not a file`);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
}

app.listen(3000, () => {
    console.log('app listening on port 3000');
});
