# CanteenAI - Campus Meal Planner

An AI-powered web app that helps university students find the best canteen meal within their budget.

## The problem
Students often struggle to choose a healthy, high-protein meal that fits their daily budget at the campus canteen.

## The solution
An AI-powered web app where students input their budget and dietary preference. The app uses an open-weight model to suggest the best meal combo from the canteen menu.

## How it works
- Model(s) used: Gemma 4 (2B) via Ollama (Local) - [Link](https://ollama.com)
- Tech Stack: Next.js, Tailwind CSS, JSON Database
- Run locally: Ensure Ollama is running with `ollama run gemma4:e2b`.

## How to run it
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`
4. Make sure Ollama is running locally.

## What's not done yet
- The AI currently works locally via Ollama. Hosting the open model on a public server is a future step.

## Credits
- Google for the open Gemma model.
- Unsplash for the food images.
