// BACKEND/app.ts

// —— IMPORT DEPENDENCIES ——

import express, { Request, Response } from 'express';          // Express powers our HTTP API
import cors from 'cors';                                       // CORS lets browsers from different origins talk to us
import Calculator from './services/Calculator';             // Our calculator service that handles the actual math logic

// Create the Express app
const app = express();

// Create a new calculator instance
const calculator = new Calculator();

// —— MIDDLEWARE SETUP ——

// Allow only specific frontend URLs to access the API
app.use(cors({
  origin: [
    'https://hradiladam.github.io',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:8000'
  ]
}));

// Automatically parse incoming JSON requests
app.use(express.json());

// Defien a type for the expected request body
interface EvaluateRequestBody {
    expression: string;
};


// —— ROUTES ——

// Handle POST requests to /evaluate
app.post('/evaluate', async (
    req: Request<Record<string, unknown>, Record<string, unknown>,EvaluateRequestBody>, 
    res: Response
) => {
    
    try {
        // Evaluate the expression using our calculator logic
        const { expression } = req.body;

        // Tuntime validation of input being a real non-empty string
        if (typeof expression !== 'string' || expression.trim() === '') {
            return res.status(400).json({ error: 'Expression must be a non-empty string'})
        }

        const result = await calculator.evaluate(expression);

        res.json({ result }); // Send back the result

    } catch (err ) {
        // Send error details (e.g., invalid input, divide by zero, etc.)
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: 'Unknown error'});
        }
    }
});

// —— EXPORT APP ——
export default app;
