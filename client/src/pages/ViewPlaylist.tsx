import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { Music, Loader2, Play, ExternalLink, Trash2 } from "lucide-react";
import { Link, useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState } from "react";

export default function ViewPlaylist() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const playlistId = parseInt(id || "0");

  const { data: playlist, isLoading: playlistLoading } = trpc.music.getMyPlaylists.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: songs, isLoading: songsLoading } = trpc.music.getPlaylistSongs.useQuery(
    { playlistId },
    { enabled: isAuthenticated && playlistId > 0 }
  );

  const deleteMutation = trpc.music.deletePlaylist.useMutation({
    onSuccess: () => {
      toast.success("Playlist deleted successfully");
      setLocation("/");
    },
    onError: (error) => {
      toast.error(`Failed to delete playlist: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      deleteMutation.mutate({ playlistId });
    }
  };

  const handlePlayPreview = (url: string | null) => {
    if (!url) {
      toast.error("No preview available for this track");
      return;
    }
    setPlayingUrl(url);
  };

  if (authLoading || playlistLoading || songsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription className="text-white/70">
              Please sign in to view playlists
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlaylist = playlist?.find((p) => p.id === playlistId);

  if (!currentPlaylist || !songs) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md">
          <CardHeader>
            <CardTitle>Playlist Not Found</CardTitle>
            <CardDescription className="text-white/70">
              The playlist you're looking for doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Music className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">Music Discovery</h1>
            </div>
          </Link>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete Playlist
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">{currentPlaylist.name}</h2>
          <p className="text-white/80">
            {currentPlaylist.service === "spotify" ? "Spotify" : "iTunes"} • {songs.length} songs • Created {new Date(currentPlaylist.createdAt).toLocaleDateString()}
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader>
            <CardTitle>Generated Upbeat Playlist</CardTitle>
            <CardDescription className="text-white/70">
              Based on your music preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="text-white/50 font-mono text-sm w-8">{index + 1}</div>
                  {song.albumArt && (
                    <img
                      src={song.albumArt}
                      alt={song.title}
                      className="w-14 h-14 rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{song.title}</div>
                    <div className="text-sm text-white/70 truncate">{song.artist}</div>
                  </div>
                  <div className="flex gap-2">
                    {song.previewUrl && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handlePlayPreview(song.previewUrl)}
                        className="hover:bg-white/10"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {song.externalId && currentPlaylist.service === "spotify" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        asChild
                        className="hover:bg-white/10"
                      >
                        <a
                          href={`https://open.spotify.com/track/${song.externalId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {playingUrl && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10 p-4">
            <div className="container mx-auto max-w-4xl">
              <audio
                src={playingUrl}
                controls
                autoPlay
                className="w-full"
                onEnded={() => setPlayingUrl(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
