var express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./router');

app.use('/', router.router);
app.listen(port, () => console.log(`listening on http://localhost:${port}`));
