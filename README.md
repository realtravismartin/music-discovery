# 🎵 Music Discovery

An AI-powered music discovery platform that helps users find new songs based on their favorite tracks. Built with React, Express, tRPC, and integrated with Spotify and iTunes APIs.

![Music Discovery](https://img.shields.io/badge/Music-Discovery-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ Features

### 🎧 Core Functionality
- **Dual Music Service Integration**: Search and discover music from both Spotify and iTunes
- **AI-Powered Recommendations**: Generate upbeat playlists based on your favorite 20 songs
- **Smart Playlist Generation**: Algorithm analyzes tempo, energy, and mood to create perfect playlists
- **Song Preview Playback**: Listen to 30-second previews before adding to playlists

### 🌐 Social & Discovery
- **Public Discovery Gallery**: Browse trending playlists from the community
- **Advanced Filtering**: Filter playlists by genre, mood, or search by name
- **Playlist Sharing**: Generate shareable links for public playlists
- **Clone Playlists**: Copy any public playlist to your own library
- **Privacy Controls**: Toggle playlist visibility (public/private)
- **Opt-in Engagement**: Enable/disable dislikes on your public playlists

### 📊 Analytics & Tracking
- **Export Tracking**: Monitor when playlists are exported to Spotify
- **Popularity Metrics**: View real-time play counts and popularity scores
- **Engagement Stats**: Track views, likes, and playlist performance
- **Export History**: See all your exported playlists with timestamps

### 🔐 Authentication & Integration
- **Spotify OAuth**: Export playlists directly to your Spotify account
- **Manus Authentication**: Secure user authentication and session management
- **Token Management**: Automatic refresh of expired OAuth tokens

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with custom music-oriented theme
- **shadcn/ui** - Beautiful, accessible component library
- **Wouter** - Lightweight routing
- **tRPC React Query** - Type-safe API calls

### Backend
- **Express 4** - Web server framework
- **tRPC 11** - End-to-end type-safe APIs
- **Drizzle ORM** - Type-safe database operations
- **MySQL/TiDB** - Relational database
- **Superjson** - Enhanced serialization for complex data types

### External APIs
- **Spotify Web API** - Music search and recommendations
- **Spotify OAuth** - User authentication and playlist export
- **iTunes Search API** - Alternative music search

## 📦 Installation

### Prerequisites
- Node.js 22.x
- pnpm 10.x
- MySQL or TiDB database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/realtravismartin/music-discovery.git
cd music-discovery
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Spotify API (get from https://developer.spotify.com/dashboard)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Manus OAuth (provided by Manus platform)
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your_app_id
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=your_name
```

4. **Set up the database**
```bash
pnpm db:push
```

5. **Start the development server**
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 🎨 Color Scheme

The app features a vibrant, music-oriented color palette:

- **Primary**: Electric purple (`oklch(0.65 0.25 280)`)
- **Accent**: Neon pink (`oklch(0.7 0.28 330)`)
- **Background**: Deep purple-blue (`oklch(0.12 0.06 280)`)
- **Gradients**: Purple-950, Fuchsia-950, Indigo-950

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Tests cover:
- Authentication flows
- Music API integrations
- Playlist operations
- Spotify OAuth
- Discovery and filtering
- Like/unlike functionality

## 📁 Project Structure

```
music-discovery/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── pages/         # Page components
│       ├── components/    # Reusable UI components
│       ├── lib/           # tRPC client setup
│       └── index.css      # Global styles & theme
├── server/                # Backend Express application
│   ├── _core/             # Core server infrastructure
│   ├── routers.ts         # tRPC route definitions
│   ├── db.ts              # Database query helpers
│   ├── spotify.ts         # Spotify API integration
│   ├── spotifyOAuth.ts    # Spotify OAuth flow
│   └── itunes.ts          # iTunes API integration
├── drizzle/               # Database schema & migrations
│   └── schema.ts          # Table definitions
└── shared/                # Shared types & constants
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm db:push` - Push database schema changes
- `pnpm check` - Type check without emitting
- `pnpm format` - Format code with Prettier

## 🌟 Key Features Explained

### Playlist Generation Algorithm

The recommendation engine analyzes:
- **Audio Features**: Tempo, energy, danceability, valence
- **Genre Matching**: Similar genres and subgenres
- **Artist Similarity**: Related artists and collaborations
- **Popularity Balance**: Mix of popular and hidden gems

### Privacy & Sharing

- Playlists are **private by default**
- Users can toggle visibility to make playlists public
- Public playlists generate unique shareable tokens
- Creators control whether dislikes are enabled

### Spotify Integration

1. User connects Spotify account via OAuth
2. Tokens are securely stored and auto-refreshed
3. Playlists can be exported with one click
4. Opens directly in Spotify app/web player

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Manus](https://manus.im) platform
- Music data from Spotify and iTunes APIs
- UI components from [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ and 🎵**
