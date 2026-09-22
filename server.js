const app = require('./src/app');

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`The music app is running at http://localhost:${PORT}`);
});
