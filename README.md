# 🍹 Sip & Savor

A mobile app to discover and save food recipes and cocktails in one place.

## 📱 Demo

🔗 **[Demo Video](https://drive.google.com/file/d/1X-jbPJS18vsrS9_zsBr_LNu9Che0vKHv/view?usp=sharing)**

## 🚀 Quick Start

### Prerequisites
- Node.js
- Expo CLI
- PostgreSQL

### Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/sip-savor.git
cd sip-savor

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Setup database
npx prisma migrate dev
npx prisma generate
```

### Environment Setup

Create `.env` in `backend/` folder:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_secret_key"
SPOONACULAR_API_KEY="your_api_key"
COCKTAILDB_API_KEY="1"
PORT=5000
```

### Run the App
```bash
# Start backend (in backend folder)
npm run dev

# Start frontend (in root folder)
npm start
```

## 🛠️ Built With

- React Native + Expo
- Node.js + Express
- PostgreSQL + Prisma
- Spoonacular API + TheCocktailDB API

## 👨‍💻 Author

Gayatri Jaiswal - 2024-B-29012006B

