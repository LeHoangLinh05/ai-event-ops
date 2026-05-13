# AI Event Operation Assistant - Frontend

**Frontend for Game Operations Team to create events quickly using AI assistance.**

## 📋 Features

- **Dashboard**: Overview of total events, draft events, published events, and AI generation count
- **Event Generator**: Create events using AI with customizable inputs
  - Event Type, Theme, Target Segment, Duration, Reward, Tone
  - AI generates: Title, Description, Push Notification, Rules, Reward Suggestion
  - Ability to regenerate individual fields
  - Save as Draft or Publish directly
- **Events Management**: 
  - View, edit, delete events
  - Filter by status and type
  - Pagination support
- **Responsive UI**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LoadingSpinner
│   │   ├── Toast
│   │   ├── Sidebar
│   │   └── Header
│   ├── pages/               # Page components
│   │   ├── Dashboard
│   │   ├── EventGenerator
│   │   └── EventList
│   ├── layouts/             # Layout components
│   │   └── MainLayout
│   ├── services/            # API services
│   │   └── apiService.ts
│   ├── hooks/               # Custom hooks
│   │   ├── useApi.ts
│   │   └── useToast.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Helper functions
│   │   └── helpers.ts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 API Integration

The frontend connects to the backend APIs:

### Event APIs
- `GET /api/events` - Get all events (with pagination)
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### AI APIs
- `POST /api/ai/generate-event` - Generate full event content
- `POST /api/ai/regenerate-field` - Regenerate specific field

### Dashboard APIs
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI Components

### Pages
1. **Dashboard** (`/`)
   - Stats cards showing total events, drafts, published, AI generations
   - Recent events section (expandable)

2. **Event Generator** (`/generator`)
   - Left panel: Input form for event parameters
   - Right panel: AI-generated content preview
   - Regenerate buttons for each field
   - Save/Publish actions

3. **Events** (`/events`)
   - Table with filterable events
   - Status badge (draft/published/archived)
   - Action buttons (view, edit, delete)
   - Pagination controls

## 🛠️ Technologies

- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Router v6**: Client-side routing
- **Axios**: HTTP client
- **Vite**: Build tool
- **Lucide React**: Icon library

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🔄 Development Workflow

1. Create a feature branch from `frontend-development`
2. Make changes and test locally
3. Commit with descriptive messages
4. Create a pull request to `frontend-development`
5. After review, merge to `frontend-development`

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in backend
- Verify API base URL in `vite.config.ts`

### Build Errors
- Clear `node_modules` and `dist` folders
- Run `npm install` again
- Check TypeScript errors with `tsc --noEmit`

## 📄 License

ISC

## 👥 Contributors

Game Operations Team
