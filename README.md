# Pokédex

I created this project to familiarize myself better with React, JavaScript, CSS, API integration, and deployment workflows.

This is a responsive Pokédex web application powered by the [PokéAPI](https://pokeapi.co/). I built it as a practical project to explore how a React application can consume external data and present it through an accessible, responsive interface.

## Features

- Browse Pokémon with their names, Pokédex numbers, and official artwork
- Search Pokémon by name or Pokédex number
- Filter Pokémon by type
- View detailed Pokémon information in a modal
- Load additional Pokémon progressively
- Responsive layout for desktop and mobile devices

## Technologies

- React
- JavaScript
- CSS
- Vite
- PokéAPI
- Vercel

## Getting Started

### Prerequisites

You need to have Node.js and npm installed.

### Installation

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Carol1207/pokedex-project.git
cd pokedex-project
npm install
```

### Run the development server

```bash
npm run dev
```

Vite will display a local URL, usually `http://localhost:5173`.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Deployment

I can deploy this project through Vercel by importing the GitHub repository. The default Vite settings work with:

- **Build command:** `npm run build`
- **Output directory:** `dist`

After deployment, each push to the repository can trigger a new production deployment automatically.

## Data

The Pokémon data is provided by [PokéAPI](https://pokeapi.co/).
