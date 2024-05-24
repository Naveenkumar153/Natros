const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.json());

const filePath = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

try {
  const stats = fs.statSync(filePath);
  if (stats.isFile()) {
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


try {
  
  app.post('/api/v1/tours', (req, res) => {
    console.log(req.body);

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId}, req.body)
    tours.push(newTour);

    fs.writeFile(filePath, JSON.stringify(tours), (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour:newTour,
        },
      });
    });
  });

} catch (error) {
  console.error(`Error: ${error.message}`);

}

app.listen(3000, () => {
    console.log('app listening on port 3000');
});
