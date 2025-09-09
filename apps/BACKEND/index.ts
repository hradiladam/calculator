// BACKEND/index.ts

import app from './app';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.listen(PORT, () => {
    console.log(`Calculator API listening on port ${PORT}`);
});
