require('./src/config/dotenv');

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`KeepUp is running at http://localhost:${PORT}`);
});
