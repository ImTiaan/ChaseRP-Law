# ChaseRP Law Database Website

This is a React-based website for the ChaseRP Law Database, featuring a glassmorphism design and full search functionality.

## Prerequisites

- Node.js installed

## Setup

1.  Navigate to the website directory:
    ```bash
    cd website
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Development

To start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

## Content Updates

The content is generated from the Markdown files in the parent directory. To update the website content after modifying the Markdown files:

1.  Run the generation script:
    ```bash
    node scripts/generate-content.js
    ```
2.  The `src/data/content.json` file will be updated.
