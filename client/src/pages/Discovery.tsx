import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Music, Search, TrendingUp, Eye, ThumbsUp, User, Copy, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

const GENRES = [
  "All Genres",
  "Pop",
  "Rock",
  "Hip Hop",
  "R&B",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "Latin",
  "Indie",
  "Alternative",
];

const MOODS = [
  "All Moods",
  "Upbeat",
  "Chill",
  "Energetic",
  "Melancholic",
  "Romantic",
  "Party",
  "Focus",
  "Relaxing",
];

export default function Discovery() {
  const { isAuthenticated } = useAuth();
  const [selectedGenre, setSelectedGenre] = useState<string>("All Genres");
  const [selectedMood, setSelectedMood] = useState<string>("All Moods");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cloning, setCloning] = useState<number | null>(null);

  const { data: playlists, isLoading } = trpc.music.getFilteredPlaylists.useQuery({
    genre: selectedGenre === "All Genres" ? undefined : selectedGenre,
    mood: selectedMood === "All Moods" ? undefined : selectedMood,
    search: searchQuery || undefined,
    limit: 50,
  });

  const cloneMutation = trpc.music.clonePlaylist.useMutation({
    onSuccess: (data) => {
      toast.success("Playlist cloned successfully!");
      setCloning(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to clone playlist");
      setCloning(null);
    },
  });

  const handleClone = (playlistId: number, playlistName: string) => {
    if (!isAuthenticated) {
      toast.error("Please log in to clone playlists");
      return;
    }
    setCloning(playlistId);
    cloneMutation.mutate({
      playlistId,
      newName: `${playlistName} (Copy)`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-indigo-950">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors cursor-pointer">
              <Music className="h-6 w-6" />
              <span className="text-xl font-bold">Music Discovery</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <a href={getLoginUrl()}>Log In</a>
              </Button>
            ) : (
              <Link href="/">
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  My Playlists
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8 text-purple-300" />
            <h1 className="text-4xl font-bold text-white">Discover Playlists</h1>
          </div>
          <p className="text-white/70 text-lg">
            Browse and clone trending playlists from the community
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              {/* Genre Filter */}
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mood Filter */}
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {MOODS.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple-300" />
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all"
              >
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span className="line-clamp-2">{playlist.name}</span>
                    <span className="text-xs bg-purple-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {playlist.service === "spotify" ? "Spotify" : "iTunes"}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    <div className="flex items-center gap-2 mt-2">
                      <User className="h-4 w-4" />
                      <span>{playlist.userName || "Anonymous"}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {playlist.genre && (
                        <span className="text-xs bg-blue-600/50 px-2 py-1 rounded-full">
                          {playlist.genre}
                        </span>
                      )}
                      {playlist.mood && (
                        <span className="text-xs bg-green-600/50 px-2 py-1 rounded-full">
                          {playlist.mood}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{playlist.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{playlist.likes}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link href={`/share/${playlist.shareToken}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-white/5 border-white/20 hover:bg-white/10">
                          View
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleClone(playlist.id, playlist.name)}
                        disabled={cloning === playlist.id}
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        {cloning === playlist.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Clone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="py-16 text-center">
              <Music className="h-16 w-16 mx-auto mb-4 text-white/50" />
              <h3 className="text-xl font-semibold mb-2">No playlists found</h3>
              <p className="text-white/60">
                Try adjusting your filters or be the first to share a public playlist!
              </p>
            </CardContent>
          </Card>
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
