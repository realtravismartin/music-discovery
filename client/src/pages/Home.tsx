import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Music, Sparkles, ListMusic } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const { data: playlists, isLoading: playlistsLoading } = trpc.music.getMyPlaylists.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Music Discovery</h1>
          </div>
          <div>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-white/80">Welcome, {user?.name}</span>
                <Link href="/create">
                  <Button variant="default" className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Playlist
                  </Button>
                </Link>
              </div>
            ) : (
              <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700">
                <a href={getLoginUrl()}>Sign In</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Discover Your Next Favorite Song
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Input your favorite 20 songs and let our AI generate an upbeat playlist tailored to your taste using Spotify and iTunes.
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-6">
              <a href={getLoginUrl()}>
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started
              </a>
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Music className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Input Your Favorites</CardTitle>
              <CardDescription className="text-white/70">
                Search and select 20 songs that you love from Spotify or iTunes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>AI-Powered Recommendations</CardTitle>
              <CardDescription className="text-white/70">
                Our algorithm analyzes your taste and generates upbeat tracks you'll love
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <ListMusic className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle>Enjoy Your Playlist</CardTitle>
              <CardDescription className="text-white/70">
                Listen to previews and discover new music that matches your vibe
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {isAuthenticated && playlists && playlists.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-white mb-8">Your Playlists</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ListMusic className="h-5 w-5 text-purple-400" />
                        {playlist.name}
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        {playlist.service === 'spotify' ? 'Spotify' : 'iTunes'} • {new Date(playlist.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
