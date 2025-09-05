# Code_Commenter

A web application that automatically generates meaningful comments for code files using AI, featuring a modern Next.js frontend for user interaction and a Flask backend for processing.

## Features

- **File Upload**: Upload text-based code files (e.g., `.py`, `.js`, `.java`) via an intuitive Next.js interface.
- **AI Comment Generation**: Leverages CodeLlama to produce concise, context-aware comments for code elements like functions, classes, and global statements.
- **Syntax Highlighting**: Displays original and commented code with modern syntax highlighting support.
- **Code Embeddings**: Generates semantic embeddings with Sentence Transformers, displayed for learning purposes.
- **Download Support**: Download the commented code as a file with the original extension.
- **Responsive Design**: Built with a modern, responsive UI that works across all devices.

## Architecture

- **Frontend**: Next.js application with TypeScript support, featuring:
  - React components for modular UI
  - Server-side rendering for better performance
  - Modern styling with CSS modules
  - TypeScript for enhanced type safety
- **Backend**: Flask server (`backend.py`) processes uploaded files, generates comments using CodeLlama, and returns the commented code.
- **Key Technologies**:
  - `Next.js`: Modern React framework for production-grade web applications
  - `TypeScript`: For type-safe development
  - `ast`: Parses Python code structure (extendable for other languages)
  - `ollama`: Interfaces with CodeLlama for comment generation
  - `sentence-transformers`: Generates code embeddings

