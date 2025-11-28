import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getLoginUrl } from "@/const";
import { Music, Search, Sparkles, X, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type Service = "spotify" | "itunes";

interface SelectedTrack {
  id: string;
  name: string;
  artist: string;
  albumArt?: string;
  service: Service;
  externalId?: string;
  trackId?: number;
  primaryGenreName?: string;
  previewUrl?: string;
  trackViewUrl?: string;
}

export default function CreatePlaylist() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [service, setService] = useState<Service>("spotify");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([]);
  const [playlistName, setPlaylistName] = useState("");

  const { data: spotifyResults, isLoading: spotifyLoading } = trpc.music.searchSpotify.useQuery(
    { query: searchQuery },
    { enabled: service === "spotify" && searchQuery.length > 2 }
  );

  const { data: itunesResults, isLoading: itunesLoading } = trpc.music.searchITunes.useQuery(
    { query: searchQuery },
    { enabled: service === "itunes" && searchQuery.length > 2 }
  );

  const generateSpotifyMutation = trpc.music.generateSpotifyPlaylist.useMutation({
    onSuccess: (data) => {
      toast.success("Playlist generated successfully!");
      setLocation(`/playlist/${data.playlistId}`);
    },
    onError: (error) => {
      toast.error(`Failed to generate playlist: ${error.message}`);
    },
  });

  const generateITunesMutation = trpc.music.generateITunesPlaylist.useMutation({
    onSuccess: (data) => {
      toast.success("Playlist generated successfully!");
      setLocation(`/playlist/${data.playlistId}`);
    },
    onError: (error) => {
      toast.error(`Failed to generate playlist: ${error.message}`);
    },
  });

  const handleAddTrack = (track: any) => {
    if (selectedTracks.length >= 20) {
      toast.error("You can only select up to 20 songs");
      return;
    }

    const newTrack: SelectedTrack = service === "spotify"
      ? {
          id: track.id,
          name: track.name,
          artist: track.artists.map((a: any) => a.name).join(", "),
          albumArt: track.album.images[0]?.url,
          service: "spotify",
          externalId: track.id,
          previewUrl: track.preview_url,
        }
      : {
          id: String(track.trackId),
          name: track.trackName,
          artist: track.artistName,
          albumArt: track.artworkUrl100,
          service: "itunes",
          trackId: track.trackId,
          primaryGenreName: track.primaryGenreName,
          previewUrl: track.previewUrl,
          trackViewUrl: track.trackViewUrl,
        };

    setSelectedTracks([...selectedTracks, newTrack]);
    setSearchQuery("");
  };

  const handleRemoveTrack = (id: string) => {
    setSelectedTracks(selectedTracks.filter((t) => t.id !== id));
  };

  const handleGenerate = () => {
    if (selectedTracks.length !== 20) {
      toast.error("Please select exactly 20 songs");
      return;
    }

    if (!playlistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    if (service === "spotify") {
      const trackIds = selectedTracks.map((t) => t.externalId!);
      generateSpotifyMutation.mutate({ trackIds, playlistName });
    } else {
      const seedTracks = selectedTracks.map((t) => ({
        trackId: t.trackId!,
        trackName: t.name,
        artistName: t.artist,
        collectionName: "",
        artworkUrl100: t.albumArt || "",
        previewUrl: t.previewUrl || "",
        trackViewUrl: t.trackViewUrl || "",
        primaryGenreName: t.primaryGenreName || "",
      }));
      generateITunesMutation.mutate({ seedTracks, playlistName });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-white text-xl">Loading...</div>
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
              Please sign in to create playlists
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

  const isSearching = service === "spotify" ? spotifyLoading : itunesLoading;
  const searchResults = service === "spotify" ? spotifyResults : itunesResults;

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
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Create Your Playlist</h2>
          <p className="text-white/80">Select 20 songs to generate an upbeat playlist recommendation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6">
              <CardHeader>
                <CardTitle>Search for Songs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Music Service</Label>
                  <RadioGroup value={service} onValueChange={(v) => setService(v as Service)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spotify" id="spotify" />
                      <Label htmlFor="spotify" className="cursor-pointer">Spotify</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="itunes" id="itunes" />
                      <Label htmlFor="itunes" className="cursor-pointer">iTunes</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search for a song..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                )}

                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {searchResults.map((track: any) => {
                      const trackData = service === "spotify"
                        ? {
                            id: track.id,
                            name: track.name,
                            artist: track.artists.map((a: any) => a.name).join(", "),
                            albumArt: track.album.images[2]?.url,
                          }
                        : {
                            id: String(track.trackId),
                            name: track.trackName,
                            artist: track.artistName,
                            albumArt: track.artworkUrl100,
                          };

                      const isSelected = selectedTracks.some((t) => t.id === trackData.id);

                      return (
                        <div
                          key={trackData.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-purple-600/30 border border-purple-400"
                              : "bg-white/5 hover:bg-white/10 border border-transparent"
                          }`}
                          onClick={() => !isSelected && handleAddTrack(track)}
                        >
                          {trackData.albumArt && (
                            <img
                              src={trackData.albumArt}
                              alt={trackData.name}
                              className="w-12 h-12 rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{trackData.name}</div>
                            <div className="text-sm text-white/70 truncate">{trackData.artist}</div>
                          </div>
                          {isSelected && <span className="text-purple-400 text-sm">Selected</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle>Selected Songs ({selectedTracks.length}/20)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white mb-2 block">Playlist Name</Label>
                  <Input
                    placeholder="My Upbeat Playlist"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                    >
                      {track.albumArt && (
                        <img
                          src={track.albumArt}
                          alt={track.name}
                          className="w-10 h-10 rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate text-sm">{track.name}</div>
                        <div className="text-xs text-white/70 truncate">{track.artist}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveTrack(track.id)}
                        className="hover:bg-white/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={selectedTracks.length !== 20 || !playlistName.trim() || generateSpotifyMutation.isPending || generateITunesMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {generateSpotifyMutation.isPending || generateITunesMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Playlist
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
