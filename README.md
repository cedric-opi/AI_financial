# FinanceAI - AI-Powered Financial Advisor Platform

A modern, clean financial advisor platform with an AI chatbot to help users make informed investment decisions. Built with a client-server architecture for scalability and maintainability.

## 🏗️ Architecture

```
financial-advisor-platform/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and helpers
│   └── public/           # Static assets
│
├── backend/           # Next.js API backend
│   ├── pages/api/       # API routes
│   ├── src/
│   │   ├── services/    # Business logic
│   │   └── utils/       # Backend utilities
│   └── types/           # TypeScript definitions
│
└── shared/            # Shared types and utilities (optional)
```

## ✨ Features

- **AI-Powered Chat**: Intelligent financial advisor chatbot
- **Portfolio Analytics**: Real-time portfolio tracking and analysis
- **Market Insights**: Market trends and investment recommendations
- **Risk Assessment**: Automated risk analysis and scoring
- **Responsive Design**: Beautiful, mobile-first UI
- **Professional Design System**: Consistent, finance-themed styling

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **Radix UI** for accessible components
- **React Query** for data fetching
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **Next.js** API routes
- **OpenAI API** for AI chat functionality
- **TypeScript** for type safety
- **Zod** for validation
- **CORS** enabled for cross-origin requests

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for AI functionality)

### Quick Start

1. **Clone and install dependencies:**
```bash
git clone <your-repo-url>
cd financial-advisor-platform
npm run setup
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Individual Component Setup

**Frontend only:**
```bash
cd frontend
npm install
npm run dev
```

**Backend only:**
```bash
cd backend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:3001

# Backend
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env` file as `OPENAI_API_KEY`
3. The system will fall back to mock responses if no API key is provided

## 📁 Project Structure Details

### Frontend (`/frontend`)
- **Components**: Reusable UI components with variants
- **Pages**: Main application pages (Home, Chat, Analytics)
- **Hooks**: Custom hooks for API calls and state management
- **Design System**: Comprehensive styling with Tailwind CSS

### Backend (`/backend`)
- **API Routes**: RESTful endpoints for chat and analytics
- **Services**: Business logic and external API integrations
- **Utils**: Validation, logging, and helper functions

## 🎨 Design System

The platform uses a professional financial design system with:
- **Color Palette**: Professional blues, success greens, warning ambers
- **Components**: Custom variants for buttons, cards, and inputs
- **Animations**: Smooth transitions and micro-interactions
- **Typography**: Clear hierarchy for financial data

### Key Design Tokens
```css
/* Primary brand colors */
--primary: 221 83% 53%;           /* Professional blue */
--success: 142 71% 45%;           /* Financial green */
--warning: 38 92% 50%;            /* Financial amber */

/* Gradients */
--gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-glow)));
```

## 🔌 API Endpoints

### Chat API
```
POST /api/chat
Body: { "message": "Your question about finance" }
Response: { "response": "AI advisor response" }
```

### Analytics API
```
GET /api/analytics
Response: { portfolio metrics, holdings, performance data }
```

## 🧪 Development

### Adding New Features

1. **Frontend components**: Add to `/frontend/src/components`
2. **API endpoints**: Add to `/backend/pages/api`
3. **Services**: Add business logic to `/backend/src/services`

### Code Quality
- TypeScript strict mode enabled
- Consistent naming conventions
- Error handling and validation
- Responsive design patterns

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy dist/ folder to your static hosting
```

### Backend Deployment
```bash
cd backend
npm run build
npm start
# Deploy to your Node.js hosting platform
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment.

## 🔐 Security Considerations

- API key protection (server-side only)
- Input validation with Zod
- CORS configuration
- Error handling without data leaks

## 🤝 Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update documentation for new components
4. Test API endpoints thoroughly

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **CORS errors**: Check backend CORS configuration
2. **API key issues**: Verify OpenAI API key in `.env`
3. **Port conflicts**: Change ports in `package.json` scripts
4. **Build errors**: Ensure all dependencies are installed

### Support

For issues and questions:
1. Check the console for error messages
2. Verify environment variables are set
3. Ensure both frontend and backend are running
4. Check API endpoint connectivity

## 🔮 Future Enhancements

- User authentication and personalized portfolios
- Real-time market data integration
- Advanced analytics and reporting
- Mobile app development
- Database integration for data persistence
- Payment system integration
- Advanced AI features and personalization