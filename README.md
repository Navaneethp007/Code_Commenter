# Code_Commenter

A web application that automatically generates meaningful comments for code files using AI, featuring a Streamlit frontend for user interaction and a Flask backend for processing.

## Features

- **File Upload**: Upload text-based code files (e.g., `.py`, `.js`, `.java`) via a Streamlit interface.
- **AI Comment Generation**: Leverages CodeLlama to produce concise, context-aware comments for code elements like functions, classes, and global statements.
- **Syntax Highlighting**: Displays original and commented code using Pygments with `TextLexer` for generic text support.
- **Code Embeddings**: Generates semantic embeddings with Sentence Transformers, displayed for learning purposes.
- **Download Support**: Download the commented code as a file with the original extension and `text/plain` MIME type.

## Architecture

- **Frontend**: Streamlit app (`frontend.py`) handles file uploads, sends HTTP requests to the backend, and displays/downloads results.
- **Backend**: Flask server (`backend.py`) processes uploaded files, generates comments using CodeLlama, and returns the commented code.
- **Key Libraries**:
  - `ast`: Parses Python code structure (extendable for other languages).
  - `ollama`: Interfaces with CodeLlama for comment generation.
  - `pygments`: Provides syntax highlighting.
  - `sentence-transformers`: Generates code embeddings.
  - `requests`: Enables frontend-backend communication.

