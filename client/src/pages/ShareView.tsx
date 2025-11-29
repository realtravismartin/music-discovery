import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Music, Loader2, Play, Eye, ThumbsUp, User, Copy, Globe } from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function ShareView() {
  const { isAuthenticated } = useAuth();
  const { token } = useParams();
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [cloning, setCloning] = useState(false);

  const { data, isLoading, error } = trpc.music.getPlaylistByShareToken.useQuery(
    { shareToken: token || "" },
    { enabled: !!token }
  );

  const cloneMutation = trpc.music.clonePlaylist.useMutation({
    onSuccess: (result) => {
      toast.success("Playlist cloned to your library!");
      setCloning(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clone playlist");
      setCloning(false);
    },
  });

  const handleClone = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to clone playlists");
      return;
    }
    if (!data?.playlist) return;
    
    setCloning(true);
    cloneMutation.mutate({
      playlistId: data.playlist.id,
      newName: `${data.playlist.name} (Copy)`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-indigo-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-indigo-950">
        <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/">
              <div className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors cursor-pointer">
                <Music className="h-6 w-6" />
                <span className="text-xl font-bold">Music Discovery</span>
              </div>
            </Link>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-16 text-center">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md mx-auto">
            <CardContent className="py-12">
              <Music className="h-16 w-16 mx-auto mb-4 text-white/50" />
              <h2 className="text-2xl font-bold mb-2">Playlist Not Found</h2>
              <p className="text-white/70 mb-6">
                This playlist may have been deleted or made private.
              </p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Go Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { playlist, songs } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors cursor-pointer">
              <Music className="h-6 w-6" />
              <span className="text-xl font-bold">Music Discovery</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/discover">
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                Discover More
              </Button>
            </Link>
            {!isAuthenticated && (
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <a href={getLoginUrl()}>Log In</a>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-400 mb-2">
            <Globe className="h-5 w-5" />
            <span className="text-sm">Public Playlist</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">{playlist.name}</h2>
          <div className="flex items-center gap-4 text-white/70">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{playlist.userName || "Anonymous"}</span>
            </div>
            <span>•</span>
            <span>{playlist.service === "spotify" ? "Spotify" : "iTunes"}</span>
            <span>•</span>
            <span>{songs.length} songs</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-white/80">
              <Eye className="h-5 w-5" />
              <span>{playlist.views} views</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <ThumbsUp className="h-5 w-5" />
              <span>{playlist.likes} likes</span>
            </div>
          </div>

          {/* Clone Button */}
          <div className="mt-6">
            <Button
              onClick={handleClone}
              disabled={cloning}
              className="bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {cloning ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Cloning...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-5 w-5" />
                  Clone to My Library
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Songs List */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <CardTitle>Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/50 w-8 text-center">{index + 1}</span>
                  {song.albumArt && (
                    <img
                      src={song.albumArt}
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{song.title}</p>
                    <p className="text-sm text-white/60 truncate">{song.artist}</p>
                  </div>
                  {song.previewUrl && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (playingUrl === song.previewUrl) {
                          setPlayingUrl(null);
                        } else {
                          setPlayingUrl(song.previewUrl);
                        }
                      }}
                      className="hover:bg-white/10"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audio Player */}
        {playingUrl && (
          <div className="fixed bottom-4 right-4 bg-black/90 p-4 rounded-lg shadow-lg">
            <audio src={playingUrl} controls autoPlay className="w-64" />
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white/70">
              <Music className="h-5 w-5" />
              <span>© {new Date().getFullYear()} Music Discovery. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
              <Link href="/terms">
                <button className="text-white/70 hover:text-white transition-colors">
                  Terms of Service
                </button>
              </Link>
              <Link href="/privacy">
                <button className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
