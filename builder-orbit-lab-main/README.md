# ZetaScript Frontend (Fusion Starter)

React SPA frontend cho hệ thống quản lý nội dung Zeta, được xây dựng với Fusion Starter template và tích hợp với Express backend.

## 🏗️ Architecture

```
client/                   # React SPA Frontend
├── pages/               # Route Components
│   ├── Index.tsx        # Home page
│   ├── Articles.tsx     # Articles listing
│   ├── Documents.tsx    # Documents listing
│   ├── Notes.tsx        # Notes listing
│   ├── Login.tsx        # Authentication
│   ├── Dashboard.tsx    # User dashboard
│   └── admin/           # Admin pages
├── components/          # Reusable Components
│   ├── ui/             # UI Component Library (Radix UI)
│   ├── Layout.tsx      # Main layout wrapper
│   └── Logo.tsx        # Brand logo
├── contexts/           # React Contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom Hooks
├── lib/                # Utilities
└── global.css          # TailwindCSS styles

server/                 # Express Development Server
├── index.ts           # Server setup
└── routes/            # API routes

shared/                # Shared Types
└── api.ts            # API interfaces
```

## 🚀 Quick Start

### 1. Cài đặt Dependencies

```bash
npm install
```

### 2. Cấu hình Environment

Tạo file `.env` (optional):

```env
VITE_API_URL=http://localhost:4000
```

### 3. Chạy Development Server

```bash
npm run dev
```

Frontend sẽ chạy trên `http://localhost:8080`

## 🎨 Tech Stack

### Core Technologies
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **React Router 6** - Client-side Routing

### UI & Styling
- **TailwindCSS 3** - Utility-first CSS
- **Radix UI** - Accessible UI Components
- **Lucide React** - Icon Library
- **Framer Motion** - Animations

### State Management
- **React Query** - Server State Management
- **React Context** - Client State Management
- **React Hook Form** - Form Management

### Development Tools
- **Vitest** - Testing Framework
- **Prettier** - Code Formatting
- **ESLint** - Code Linting

## 🛣️ Routing System

### Public Routes
```
/                    # Home page
/articles            # Articles listing
/articles/:id        # Article detail
/documents           # Documents listing
/notes               # Notes listing
/search              # Search page
/login               # User login
/register            # User registration
```

### Protected Routes
```
/account             # User account
/dashboard           # User dashboard
/share               # Share content
```

### Admin Routes
```
/admin/dashboard     # Admin dashboard
/admin/content       # Content management
/admin/content/new   # Create content
/admin/content/edit/:id # Edit content
/admin/users         # User management
/admin/analytics     # Analytics
/admin/activity      # Activity logs
/admin/settings      # System settings
/admin/categories    # Category management
/admin/tags          # Tag management
```

## 🎯 Key Features

### User Features
- ✅ **Home Page** - Content preview và navigation
- ✅ **Content Browsing** - Articles, documents, notes
- ✅ **Search** - Full-text search functionality
- ✅ **Authentication** - Login/register system
- ✅ **User Dashboard** - Personal content management
- ✅ **Account Management** - Profile settings

### Admin Features
- ✅ **Admin Dashboard** - System overview
- ✅ **Content Management** - CRUD operations
- ✅ **User Management** - User administration
- ✅ **Analytics** - Usage statistics
- ✅ **Activity Logs** - System monitoring
- ✅ **Settings** - System configuration
- ✅ **Category/Tag Management** - Content organization

### Technical Features
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Mode** - Theme switching
- ✅ **Real-time Updates** - React Query integration
- ✅ **Form Validation** - Zod + React Hook Form
- ✅ **Error Handling** - Global error boundaries
- ✅ **Loading States** - Skeleton loaders
- ✅ **Toast Notifications** - User feedback

## 🎨 UI Components

### Component Library
Dựa trên Radix UI với TailwindCSS styling:

```typescript
// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Form components
<Input placeholder="Enter text..." />
<Textarea placeholder="Enter description..." />
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>

// Layout components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Custom Components
- `Layout` - Main layout wrapper với navigation
- `Logo` - Brand logo component
- `AdminLayout` - Admin-specific layout

## 🔐 Authentication System

### AuthContext
```typescript
const { user, isLoggedIn, isAdmin, login, logout } = useAuth();

// Login
const handleLogin = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (response.ok) {
    const { user, token } = await response.json();
    login(user, token);
  }
};

// Protected route
if (!isLoggedIn) {
  return <Navigate to="/login" />;
}
```

### Role-based Access
```typescript
// Admin only content
{isAdmin && (
  <AdminPanel />
)}

// User role check
{user?.role === 'admin' && (
  <AdminFeatures />
)}
```

## 📡 API Integration

### React Query Setup
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

### API Hooks
```typescript
// Fetch content
const { data: content, isLoading, error } = useQuery({
  queryKey: ['content'],
  queryFn: () => fetch('/api/content').then(res => res.json())
});

// Create content
const createMutation = useMutation({
  mutationFn: (newContent) => 
    fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContent)
    }),
  onSuccess: () => {
    queryClient.invalidateQueries(['content']);
  }
});
```

## 🎨 Styling System

### TailwindCSS Configuration
```typescript
// tailwind.config.ts
export default {
  content: ['./client/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        // ... custom colors
      }
    }
  }
}
```

### CSS Variables
```css
/* global.css */
:root {
  --primary: 222.2 84% 4.9%;
  --secondary: 210 40% 98%;
  --muted: 210 40% 96%;
  /* ... theme variables */
}
```

### Utility Classes
```typescript
// cn utility for conditional classes
import { cn } from '@/lib/utils';

<Button 
  className={cn(
    "base-classes",
    { "conditional-class": condition },
    props.className
  )}
>
  Button
</Button>
```

## 🧪 Testing

### Test Setup
```bash
npm test
```

### Test Structure
```
tests/
├── components/        # Component tests
├── pages/            # Page tests
├── hooks/            # Hook tests
└── utils/            # Utility tests
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import { Index } from '@/pages/Index';

test('renders home page', () => {
  render(<Index />);
  expect(screen.getByText('Welcome to ZetaScript')).toBeInTheDocument();
});
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start dev server
npm run typecheck    # TypeScript validation
npm test            # Run tests
```

### Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Build Output
```
dist/
├── spa/            # Static assets
└── server/         # Server bundle
```

## 🔧 Development Workflow

### Adding New Pages
1. Create component in `client/pages/`
2. Add route in `client/App.tsx`
3. Update navigation if needed

```typescript
// client/pages/NewPage.tsx
export default function NewPage() {
  return (
    <Layout>
      <h1>New Page</h1>
    </Layout>
  );
}

// client/App.tsx
<Route path="/new-page" element={<NewPage />} />
```

### Adding New Components
1. Create component in `client/components/`
2. Export from appropriate index file
3. Use in pages

```typescript
// client/components/NewComponent.tsx
interface NewComponentProps {
  title: string;
}

export function NewComponent({ title }: NewComponentProps) {
  return <div>{title}</div>;
}
```

### API Integration
1. Define types in `shared/api.ts`
2. Create API calls in components
3. Use React Query for state management

```typescript
// shared/api.ts
export interface NewApiResponse {
  data: any[];
  total: number;
}

// In component
const { data } = useQuery<NewApiResponse>({
  queryKey: ['new-api'],
  queryFn: () => fetch('/api/new-endpoint').then(res => res.json())
});
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile-first Approach
```typescript
<div className="
  grid grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
  {/* Responsive grid */}
</div>
```

## 🎯 Performance Optimization

### Code Splitting
- Automatic route-based splitting
- Lazy loading for admin pages
- Dynamic imports for heavy components

### Image Optimization
- WebP format support
- Lazy loading
- Responsive images

### Bundle Optimization
- Tree shaking
- Dead code elimination
- Minification

## 🛠️ Troubleshooting

### Common Issues

1. **Build Errors**
   - Check TypeScript errors: `npm run typecheck`
   - Verify imports and exports
   - Check TailwindCSS classes

2. **API Connection Issues**
   - Verify backend is running on port 4000
   - Check CORS configuration
   - Verify API endpoints

3. **Styling Issues**
   - Check TailwindCSS configuration
   - Verify CSS imports
   - Check component className props

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📚 Resources

- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [React Query](https://tanstack.com/query)
- [Vite](https://vitejs.dev/)

## 📝 License

MIT License - see LICENSE file for details.
