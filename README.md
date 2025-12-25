# Desktop Calendar

A Google Calendar-like desktop application built with Tauri, React, and Rust. Designed for offline use with local data storage.

## Features

- 📅 **Local Calendar**: Full calendar functionality without internet.
- 🔔 **Notifications**: Offline notifications for events.
- 🔒 **Privacy**: All data is stored locally on your machine.
- ⚡ **Fast & Lightweight**: Built with Rust and React.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: [Download Node.js](https://nodejs.org/) (Latest LTS recommended)
- **Rust & Cargo**: [Install Rust](https://www.rust-lang.org/tools/install)
- **C++ Build Tools** (Windows only): Required for compiling native dependencies. You can install these via the "Desktop development with C++" workload in Visual Studio Build Tools.

## Installation

1. Navigate to the project directory:
   ```bash
   cd Desktop-Calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run tauri dev
```

This command will start the Vite frontend server and launch the Tauri application window.

## Building for Production

To build the application for distribution:

```bash
npm run tauri build
```

The build artifacts will be located in the `src-tauri/target/release/bundle` directory.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Rust (Tauri)
- **Utilities**: date-fns, clsx, tailwind-merge

## Project Structure

- `src/`: Frontend React source code.
- `src-tauri/`: Rust backend and Tauri configuration.
- `dist/`: Frontend build output.