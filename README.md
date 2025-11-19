# PokemonX

An experimental Pokemon exploration app built with Next.js, Tailwind CSS, and shadcn/ui, powered by the [PokeAPI](https://pokeapi.co/).

## Features

- 🎨 **Dual View Modes**: Switch between Modern and ASCII art views for a unique browsing experience
- 🔍 **Pokemon Search**: Search and discover Pokemon from the PokeAPI
- 📱 **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly interface
- 🎯 **Component Library**: Uses shadcn/ui for beautiful, accessible UI components
- 🖼️ **ASCII Art**: View Pokemon in retro ASCII art format

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com)
- **API**: [PokeAPI](https://pokeapi.co/)
- **Language**: TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components (Modern and ASCII views)
- `src/contexts/` - React contexts (UI mode switching)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and API clients
- `src/types/` - TypeScript type definitions

## View Modes

The app features a view switch that allows you to toggle between:

- **Modern View**: A sleek, contemporary UI with images and modern design elements
- **ASCII View**: A retro ASCII art representation of Pokemon and the interface

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS framework
- [shadcn/ui Documentation](https://ui.shadcn.com) - re-usable components built with Radix UI and Tailwind CSS
- [PokeAPI Documentation](https://pokeapi.co/docs/v2) - RESTful Pokemon API

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
