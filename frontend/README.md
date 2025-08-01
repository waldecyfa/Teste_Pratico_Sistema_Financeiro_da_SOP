# SOP Financial Control System - Frontend

This is the frontend application for the SOP Financial Control System, built with Next.js, Redux, and Axios.

## Requirements

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `components/`: Reusable UI components
- `pages/`: Next.js pages
- `redux/`: Redux store, actions, and reducers
- `services/`: API services using Axios
- `styles/`: Global styles and theme configuration
- `utils/`: Utility functions

## Features

- Registration, viewing, editing, and deletion of Expenses, Commitments, and Payments
- Form validation
- State management with Redux
- API integration with Axios