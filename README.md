# PowerPoint Maker Web App

This project is a migration of the original CLI-based PowerPoint maker to a modern web application.

## Project Structure

- `backend/`: FastAPI application handling logic and PPT generation.
- `frontend/`: React + TypeScript + Tailwind CSS application for the user interface.
- `data/`: Contains the migrated `songs_db.json`.

## Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Set your environment variables in `.env`:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## How to use

1. Open the frontend in your browser (usually `http://localhost:5173`).
2. Fill in the service details (Date, Speaker, Topic).
3. Search for songs in the middle column and add them to the "Worship" or "Response" sets.
4. Enter the Bible reference.
5. Click "Generate PPTX" to download your finished presentation.

## Future Enhancements
- [ ] Connect to MongoDB Atlas for persistent storage.
- [ ] Add ability to edit song lyrics directly in the UI.
- [ ] Drag and drop reordering for songs.
- [ ] Custom announcement slides.
