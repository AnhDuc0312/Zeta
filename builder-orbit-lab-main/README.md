# Zeta CMS Frontend (Fusion Starter)

React SPA frontend cho hệ thống quản lý nội dung Zeta CMS, được xây dựng với Fusion Starter template và tích hợp với Express backend API.

## 🏗️ Architecture

```
client/                   # React SPA Frontend
├── pages/               # Route Components (36+ pages)
│   ├── Index.tsx        # Home page
│   ├── Articles.tsx     # Articles listing & management
│   ├── Documents.tsx    # Documents listing & management
│   ├── Notes.tsx        # Notes listing & management
│   ├── Login.tsx        # User authentication
│   ├── Register.tsx     # User registration
│   ├── Dashboard.tsx    # User dashboard
│   ├── Search.tsx       # Search functionality
│   ├── Profile.tsx      # User profile management
│   └── admin/           # Admin pages (10+ admin pages)
│       ├── AdminDashboard.tsx
│       ├── ContentManagement.tsx
│       ├── UserManagement.tsx
│       ├── Analytics.tsx
│       └── Settings.tsx
├── components/          # Reusable Components (80+ components)
│   ├── ui/             # Radix UI Component Library (50+ components)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dialog.tsx
│   │   ├── Toast.tsx
│   │   └── ... (50+ more UI components)
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Logo.tsx        # Brand logo component
│   ├── ImageGallery.tsx # Image gallery component
│   ├── ImagePreview.tsx # Image preview modal
│   ├── ImageUpload.tsx  # File upload component
│   └── ... (30+ more custom components)
├── contexts/           # React Context Providers (4 contexts)
│   ├── AuthContext.tsx # Authentication state management
│   ├── ToastContext.tsx # Toast notification system
│   └── ... (2 more contexts)
├── hooks/              # Custom React Hooks (6 hooks)
│   ├── useAuth.ts      # Authentication hook
│   ├── useToast.ts     # Toast notification hook
│   └── ... (4 more hooks)
├── lib/                # Utility Functions
│   ├── utils.ts        # Common utilities
│   ├── api.ts          # API client functions
│   └── validations.ts  # Form validation schemas
├── mocks/              # MSW Mock Handlers
│   ├── handlers.ts     # API mock handlers
│   └── server.ts       # MSW server setup
├── __tests__/          # Frontend Test Suite
│   ├── components/     # Component tests
│   ├── pages/          # Page tests
│   └── hooks/          # Hook tests
└── global.css          # TailwindCSS styles & theme

server/                 # Express Development Server
├── index.ts           # Server setup & configuration
├── node-build.ts      # Production build entry
└── routes/            # API routes (minimal for dev)

shared/                # Shared TypeScript Types
├── api.ts            # API interfaces & types
└── favicon.ico       # Shared favicon

dist/                  # Production Build Output
├── spa/              # Static React assets
└── server/           # Server bundle

public/                # Static Assets
├── favicon.ico       # Site favicon
├── robots.txt        # SEO robots file
└── placeholder.svg   # Placeholder images
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
- **React 18.3+** - Modern UI Framework với concurrent features
- **TypeScript 5.5+** - Full type safety throughout
- **Vite 6.2+** - Lightning-fast build tool & dev server
- **React Router 6.26+** - Client-side routing với SPA mode

### UI & Styling
- **TailwindCSS 3.4+** - Utility-first CSS với custom design system
- **Radix UI** - 50+ accessible, unstyled UI components
- **Lucide React 0.462+** - Beautiful icon library
- **Framer Motion 12.6+** - Production-ready animations
- **Next Themes 0.3+** - Theme switching (dark/light mode)

### State Management & Data Fetching
- **TanStack React Query 5.56+** - Powerful server state management
- **React Context** - Client state management (4 contexts)
- **React Hook Form 7.53+** - Performant forms với validation
- **Zod 3.23+** - TypeScript-first schema validation

### UI Components & Interactions
- **Headless UI 2.2+** - Unstyled, accessible UI components
- **CMDK 1.0+** - Command palette component
- **Embla Carousel 8.3+** - Carousel/slider components
- **React Resizable Panels 2.1+** - Resizable panel layouts
- **Sonner 1.5+** - Toast notification system

### Development & Testing
- **Vitest 3.1+** - Fast unit testing framework
- **Testing Library** - Component testing utilities
- **MSW 2.11+** - API mocking cho development
- **Prettier 3.5+** - Code formatting
- **ESLint** - Code linting với TypeScript support

### Build & Deployment
- **Vite Build** - Optimized production builds
- **SWC** - Fast TypeScript/JavaScript compilation
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🛣️ Routing System

### Public Routes
```
/                    # Home page - Content overview
/articles            # Articles listing & management
/articles/:id        # Article detail view
/documents           # Documents listing & management  
/documents/:id       # Document detail view
/notes               # Notes listing & management
/notes/:id           # Note detail view
/search              # Search functionality
/login               # User authentication
/register            # User registration
/profile             # User profile (public view)
```

### Protected Routes (Require Authentication)
```
/dashboard           # User dashboard
/account             # Account management
/account/profile     # Profile settings
/account/settings    # Account preferences
/share               # Share content functionality
/bookmarks           # User bookmarks
/favorites           # User favorites
```

### Admin Routes (Require Admin Role)
```
/admin/              # Admin dashboard overview
/admin/dashboard     # Admin analytics dashboard
/admin/content       # Content management
/admin/content/new   # Create new content
/admin/content/edit/:id # Edit existing content
/admin/users         # User management
/admin/users/:id     # User detail & management
/admin/analytics     # Analytics & reports
/admin/activity      # Activity logs & monitoring
/admin/settings      # System settings
/admin/categories    # Category management
/admin/tags          # Tag management
/admin/upload        # File upload management
/admin/backup        # Data backup & restore
```

### Special Routes
```
/api-docs            # API documentation (Swagger UI)
/health              # Health check endpoint
/404                 # Not found page
/500                 # Server error page
```

## 🎯 Key Features

### 🏠 User Experience
- ✅ **Modern Home Page** - Content overview với featured content
- ✅ **Content Browsing** - Articles, documents, notes với advanced filtering
- ✅ **Advanced Search** - Full-text search với filters và sorting
- ✅ **User Authentication** - Secure login/register với JWT
- ✅ **Personal Dashboard** - User-specific content management
- ✅ **Profile Management** - Avatar, bio, preferences
- ✅ **Bookmark System** - Save content for later
- ✅ **Like System** - Like/unlike content
- ✅ **Comment System** - Interactive comments với moderation

### 🛠️ Admin Features
- ✅ **Admin Dashboard** - Comprehensive system overview
- ✅ **Content Management** - Full CRUD operations cho all content types
- ✅ **User Management** - User administration với role management
- ✅ **Analytics Dashboard** - Usage statistics và reports
- ✅ **Activity Monitoring** - Real-time activity logs
- ✅ **System Settings** - Configurable system parameters
- ✅ **Category/Tag Management** - Content organization tools
- ✅ **File Management** - Upload, organize, và optimize files
- ✅ **Backup & Restore** - Data management tools

### 🎨 UI/UX Features
- ✅ **Responsive Design** - Mobile-first responsive layout
- ✅ **Dark/Light Mode** - Theme switching với system preference detection
- ✅ **Modern UI Components** - 50+ Radix UI components
- ✅ **Smooth Animations** - Framer Motion animations
- ✅ **Loading States** - Skeleton loaders và progress indicators
- ✅ **Toast Notifications** - User feedback system
- ✅ **Modal Dialogs** - Accessible modal system
- ✅ **Command Palette** - Quick navigation và actions

### 🔧 Technical Features
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **State Management** - React Query + Context API
- ✅ **Form Validation** - Zod + React Hook Form integration
- ✅ **Error Handling** - Global error boundaries
- ✅ **API Integration** - RESTful API với React Query
- ✅ **File Upload** - Drag & drop file upload với preview
- ✅ **Image Gallery** - Advanced image viewing và management
- ✅ **Real-time Updates** - Optimistic updates với React Query
- ✅ **Performance** - Code splitting và lazy loading
- ✅ **Testing** - Comprehensive test coverage với Vitest

## 🎨 UI Components

### Radix UI Component Library (50+ Components)
Dựa trên Radix UI với TailwindCSS styling và custom design system:

```typescript
// Button variants với custom styling
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Form components với validation
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

// Dialog & Modal components
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <DialogDescription>Description</DialogDescription>
  </DialogContent>
</Dialog>

// Toast notifications
<Toast>
  <ToastTitle>Success</ToastTitle>
  <ToastDescription>Operation completed</ToastDescription>
</Toast>
```

### Custom Components (30+ Components)
- `Layout` - Main layout wrapper với navigation
- `Logo` - Brand logo component
- `AdminLayout` - Admin-specific layout
- `ImageGallery` - Advanced image gallery với lightbox
- `ImagePreview` - Image preview modal
- `ImageUpload` - Drag & drop file upload
- `SearchBar` - Advanced search component
- `ContentCard` - Content display card
- `UserAvatar` - User avatar component
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling
- `CommandPalette` - Quick command interface

## 🔐 Authentication System

### AuthContext Implementation
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "moderator" | "user";
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (userData: User, tokenValue?: string) => void;
  logout: () => Promise<void>;
}

// Usage trong components
const { user, isLoggedIn, isAdmin, loading, login, logout } = useAuth();

// Login với error handling
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (response.ok) {
      const { user, token } = await response.json();
      login(user, token);
      toast.success('Login successful!');
    } else {
      const error = await response.json();
      toast.error(error.message || 'Login failed');
    }
  } catch (error) {
    toast.error('Network error');
  }
};

// Protected route với loading state
if (loading) return <LoadingSpinner />;
if (!isLoggedIn) return <Navigate to="/login" />;
```

### Role-based Access Control
```typescript
// Admin only content
{isAdmin && (
  <AdminPanel />
)}

// Specific role checks
{user?.role === 'admin' && (
  <AdminFeatures />
)}

{user?.role === 'moderator' && (
  <ModeratorFeatures />
)}

// Permission-based rendering
const canEdit = user?.role === 'admin' || user?.id === content.author_id;
{canEdit && (
  <EditButton />
)}
```

### Authentication Hooks
```typescript
// useAuth hook
const { user, isLoggedIn, isAdmin, login, logout } = useAuth();

// useToast hook for notifications
const { toast } = useToast();

// Custom hook for protected data
const useProtectedData = (endpoint: string) => {
  const { isLoggedIn } = useAuth();
  
  return useQuery({
    queryKey: [endpoint],
    queryFn: () => fetch(endpoint).then(res => res.json()),
    enabled: isLoggedIn
  });
};
```

## 📡 API Integration

### React Query Setup
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// App setup
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Routes */}
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### API Hooks & Data Fetching
```typescript
// Content management hooks
const useContent = (filters?: ContentFilters) => {
  return useQuery({
    queryKey: ['content', filters],
    queryFn: () => fetchContent(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

const useContentById = (id: string) => {
  return useQuery({
    queryKey: ['content', id],
    queryFn: () => fetchContentById(id),
    enabled: !!id,
  });
};

// Mutations với optimistic updates
const useCreateContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createContent,
    onMutate: async (newContent) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['content']);
      
      // Snapshot previous value
      const previousContent = queryClient.getQueryData(['content']);
      
      // Optimistically update
      queryClient.setQueryData(['content'], (old: any) => [
        ...(old || []),
        { ...newContent, id: 'temp-id' }
      ]);
      
      return { previousContent };
    },
    onError: (err, newContent, context) => {
      // Rollback on error
      queryClient.setQueryData(['content'], context?.previousContent);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries(['content']);
    },
  });
};

// Search functionality
const useSearch = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchContent(query, filters),
    enabled: query.length > 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
```

### API Client Functions
```typescript
// lib/api.ts
const API_BASE = import.meta.env.VITE_API_URL || '';

export const fetchContent = async (filters?: ContentFilters) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/api/content?${params}`);
  if (!response.ok) throw new Error('Failed to fetch content');
  return response.json();
};

export const createContent = async (content: CreateContentData) => {
  const response = await fetch(`${API_BASE}/api/content`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(content),
  });
  if (!response.ok) throw new Error('Failed to create content');
  return response.json();
};

export const searchContent = async (query: string, filters?: SearchFilters) => {
  const params = new URLSearchParams({ q: query, ...filters });
  const response = await fetch(`${API_BASE}/api/search?${params}`);
  if (!response.ok) throw new Error('Search failed');
  return response.json();
};
```

## 🎨 Styling System

### TailwindCSS Configuration
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./client/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

### CSS Variables & Theme System
```css
/* global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Utility Classes & Component Styling
```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage trong components
import { cn } from '@/lib/utils';

<Button 
  className={cn(
    "inline-flex items-center justify-center rounded-md text-sm font-medium",
    "ring-offset-background transition-colors focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
      "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
    },
    props.className
  )}
>
  Button
</Button>
```

## 🧪 Testing

### Test Setup
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure
```
client/__tests__/
├── components/        # Component tests (80+ components)
│   ├── ImageGallery.test.tsx
│   ├── ImagePreview.test.tsx
│   └── ImageUpload.test.tsx
├── pages/            # Page tests (36+ pages)
│   ├── Articles.test.tsx
│   ├── Documents.test.tsx
│   └── SearchIntegration.test.tsx
├── hooks/            # Hook tests (6+ hooks)
│   └── useToast.test.ts
└── contexts/         # Context tests (4+ contexts)
    └── ToastContext.test.tsx
```

### Example Test
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Index } from '@/pages/Index';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

test('renders home page with content', async () => {
  const queryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  );
  
  expect(screen.getByText('Welcome to Zeta CMS')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
});

test('handles search functionality', async () => {
  const queryClient = createTestQueryClient();
  
  render(
    <QueryClientProvider client={queryClient}>
      <Index />
    </QueryClientProvider>
  );
  
  const searchInput = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchInput, { target: { value: 'test query' } });
  
  expect(searchInput).toHaveValue('test query');
});
```

### MSW Mock Setup
```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/content', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', title: 'Test Article', type: 'article' },
        { id: '2', title: 'Test Document', type: 'document' },
      ])
    );
  }),
  
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: '1', email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token'
      })
    );
  }),
];
```

## 🚀 Build & Deployment

### Development
```bash
# Start development server
npm run dev          # Frontend: http://localhost:8080

# Type checking
npm run typecheck    # TypeScript validation

# Run tests
npm test            # Run all tests
npm run test:watch  # Watch mode
npm run test:ui     # UI test runner

# Code formatting
npm run format.fix  # Format code with Prettier
```

### Production Build
```bash
# Build both client and server
npm run build

# Build client only
npm run build:client

# Build server only  
npm run build:server

# Start production server
npm start
```

### Build Output Structure
```
dist/
├── spa/                    # Static React assets
│   ├── index.html         # Main HTML file
│   ├── assets/            # CSS, JS, images
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── images/
│   └── favicon.ico
└── server/                 # Server bundle
    ├── node-build.mjs     # Production server entry
    └── routes/            # Server routes
```

### Environment Variables
```env
# Development
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Zeta CMS

# Production
VITE_API_URL=https://api.zetacms.com
VITE_APP_NAME=Zeta CMS
```

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    outDir: 'dist/spa',
    sourcemap: true,
  },
});
```

## 🔧 Development Workflow

### Adding New Pages
1. Create component in `client/pages/`
2. Add route in `client/App.tsx`
3. Update navigation if needed
4. Add tests in `client/__tests__/pages/`

```typescript
// client/pages/NewPage.tsx
import { Layout } from '@/components/Layout';
import { useContent } from '@/hooks/useContent';

export default function NewPage() {
  const { data: content, isLoading, error } = useContent();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading content</div>;
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">New Page</h1>
        <div className="grid gap-4">
          {content?.map(item => (
            <div key={item.id} className="p-4 border rounded">
              <h2>{item.title}</h2>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// client/App.tsx
<Route path="/new-page" element={<NewPage />} />
```

### Adding New Components
1. Create component in `client/components/`
2. Add TypeScript interfaces
3. Export from appropriate index file
4. Add tests
5. Use in pages

```typescript
// client/components/NewComponent.tsx
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NewComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
  className?: string;
}

export function NewComponent({ 
  title, 
  description, 
  onAction, 
  className 
}: NewComponentProps) {
  return (
    <div className={cn("p-4 border rounded-lg", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          Action
        </Button>
      )}
    </div>
  );
}
```

### API Integration
1. Define types in `shared/api.ts`
2. Create API client functions in `client/lib/api.ts`
3. Create custom hooks in `client/hooks/`
4. Use React Query for state management

```typescript
// shared/api.ts
export interface NewApiResponse {
  data: any[];
  total: number;
  page: number;
  limit: number;
}

export interface NewApiRequest {
  page?: number;
  limit?: number;
  search?: string;
}

// client/lib/api.ts
export const fetchNewData = async (params?: NewApiRequest) => {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(`/api/new-endpoint?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

// client/hooks/useNewData.ts
export const useNewData = (params?: NewApiRequest) => {
  return useQuery({
    queryKey: ['new-data', params],
    queryFn: () => fetchNewData(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// In component
const { data, isLoading, error } = useNewData({ page: 1, limit: 10 });
```

### Adding New Hooks
1. Create hook in `client/hooks/`
2. Add TypeScript types
3. Write tests
4. Export from hooks index

```typescript
// client/hooks/useLocalStorage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (sm)
- **Tablet**: 768px - 1024px (md)
- **Desktop**: 1024px - 1280px (lg)
- **Large Desktop**: > 1280px (xl)

### Mobile-first Approach
```typescript
// Responsive grid layout
<div className="
  grid grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-5 
  gap-4
">
  {content.map(item => (
    <ContentCard key={item.id} content={item} />
  ))}
</div>

// Responsive text sizing
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Responsive Title
</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  Content with responsive padding
</div>
```

### Responsive Navigation
```typescript
// Mobile hamburger menu
<div className="md:hidden">
  <Button variant="ghost" size="sm">
    <Menu className="h-6 w-6" />
  </Button>
</div>

// Desktop navigation
<nav className="hidden md:flex space-x-6">
  <Link to="/articles">Articles</Link>
  <Link to="/documents">Documents</Link>
  <Link to="/notes">Notes</Link>
</nav>
```

## 🎯 Performance Optimization

### Code Splitting & Lazy Loading
```typescript
// Route-based code splitting
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement = lazy(() => import('@/pages/admin/UserManagement'));

// Component lazy loading
const HeavyComponent = lazy(() => import('@/components/HeavyComponent'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

### Image Optimization
```typescript
// Responsive images với lazy loading
<img
  src={imageUrl}
  alt={altText}
  loading="lazy"
  className="w-full h-auto object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// WebP support với fallback
<picture>
  <source srcSet={webpUrl} type="image/webp" />
  <img src={fallbackUrl} alt={altText} />
</picture>
```

### Bundle Optimization
- **Tree Shaking**: Automatic dead code elimination
- **Dynamic Imports**: Lazy load heavy components
- **Vite Optimization**: Fast builds với SWC compilation
- **CSS Purging**: Remove unused TailwindCSS classes

## 🛠️ Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Check TypeScript errors
   npm run typecheck
   
   # Check for missing dependencies
   npm install
   
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **API Connection Issues**
   - Verify backend is running on port 4000
   - Check CORS configuration in backend
   - Verify API endpoints in browser dev tools
   - Check network tab for failed requests

3. **Styling Issues**
   - Verify TailwindCSS classes are correct
   - Check if classes are purged (add to safelist)
   - Verify CSS imports in main files
   - Check component className props

4. **React Query Issues**
   - Check query keys are consistent
   - Verify API responses match expected format
   - Check for stale closures in useEffect
   - Enable React Query devtools

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable React Query devtools
# Add to your component:
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In your app:
<ReactQueryDevtools initialIsOpen={false} />
```

### Performance Debugging
```bash
# Bundle analysis
npm run build
npx vite-bundle-analyzer dist/spa

# Lighthouse audit
# Use Chrome DevTools > Lighthouse tab
```

## 📚 Resources

### Core Technologies
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router v6](https://reactrouter.com/)

### UI & Styling
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Components](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

### State Management
- [TanStack Query](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW Mocking](https://mswjs.io/)

## 📝 License

MIT License - see LICENSE file for details.

---

**Zeta CMS Frontend** - Modern React SPA với TypeScript, TailwindCSS, và Radix UI
