"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Sermon } from "@/lib/api/db";

export default function SermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [liveLink, setLiveLink] = useState("");
  const [isLiveEnabled, setIsLiveEnabled] = useState(false);
  const [isUpdatingLive, setIsUpdatingLive] = useState(false);
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const YOUTUBE_VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;

  const extractYouTubeVideoId = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;

    if (YOUTUBE_VIDEO_ID.test(trimmed)) {
      return trimmed;
    }

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
      const url = new URL(withProtocol);
      const host = url.hostname.replace(/^www\./, "").toLowerCase();

      if (host === "youtu.be") {
        const shortId = url.pathname.split("/").filter(Boolean)[0] || "";
        return YOUTUBE_VIDEO_ID.test(shortId) ? shortId : null;
      }

      const queryId = url.searchParams.get("v") || "";
      if (YOUTUBE_VIDEO_ID.test(queryId)) {
        return queryId;
      }

      const pathParts = url.pathname.split("/").filter(Boolean);
      const markerIndex = pathParts.findIndex(
        (part) => part === "embed" || part === "shorts" || part === "live"
      );

      if (markerIndex >= 0) {
        const pathId = pathParts[markerIndex + 1] || "";
        return YOUTUBE_VIDEO_ID.test(pathId) ? pathId : null;
      }
    } catch {
      return null;
    }

    return null;
  };

  const normalizeYouTubeLink = (input: string): string | null => {
    const id = extractYouTubeVideoId(input);
    return id ? `https://www.youtube.com/watch?v=${id}` : null;
  };

  const fetchSermons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sermons", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch sermons");
      }
      const data = await res.json();
      setSermons(data.sermons || []);
      setLiveLink(data.livestream?.link || "");
      setIsLiveEnabled(data.livestream?.active || false);
    } catch (error) {
      console.error("Failed to fetch sermons:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const [formData, setFormData] = useState({
    title: "", link: "", date: "", description: ""
  });

  const handleSave = async () => {
    try {
      const res = await fetch("/api/sermons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Failed to save sermon");
      }

      setIsAddOpen(false);
      toast.success("Sermon uploaded.");
      await fetchSermons();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Unable to upload sermon. Please try again.");
    }
  };

  const handleUpdateLive = async () => {
    const trimmedLink = liveLink.trim();
    const normalizedLink = trimmedLink ? normalizeYouTubeLink(trimmedLink) : null;

    if (trimmedLink && !normalizedLink) {
      toast.error("Enter a valid YouTube link or 11-character video ID.");
      return;
    }

    if (isLiveEnabled && !normalizedLink) {
      toast.error("Enable on Homepage requires a valid YouTube link.");
      return;
    }

    setIsUpdatingLive(true);

    try {
      const res = await fetch("/api/livestream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          link: normalizedLink || "",
          active: isLiveEnabled,
        }),
        cache: "no-store",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update livestream");
      }

      const updated = await res.json();
      setLiveLink(updated.link || "");
      setIsLiveEnabled(Boolean(updated.active));
      toast.success("Livestream updated successfully.");
      await fetchSermons();
    } catch (error) {
      console.error("Failed to update livestream:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update livestream.");
    } finally {
      setIsUpdatingLive(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Sermons & Live</h2>
        <p className="text-muted-foreground mt-1">Manage Sunday livestreams and the sermon archive.</p>
      </div>

      <Card className="border-primary/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 text-red-500">🔴</span> {/* Replaced Video icon */}
            <CardTitle>Active Livestream</CardTitle>
          </div>
          <CardDescription>
            Update the YouTube link for the current Sunday service. When enabled, this overrides the default video on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end relative z-10">
            <div className="grid gap-2 flex-1 w-full">
              <Label htmlFor="live-link">YouTube Video ID / Link</Label>
              <div className="relative">
                {/* Removed LinkIcon */}
                <Input id="live-link" placeholder="e.g. https://youtube.com/watch?v=..." value={liveLink} onChange={(e) => setLiveLink(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center space-x-2 pb-2 w-full sm:w-auto">
              <Switch id="live-active" checked={isLiveEnabled} onCheckedChange={setIsLiveEnabled} />
              <Label htmlFor="live-active">Enable on Homepage</Label>
            </div>
            <Button className="w-full sm:w-auto" onClick={handleUpdateLive} disabled={isUpdatingLive}>
              {isUpdatingLive ? "Updating..." : "Update Livestream"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-8">
        <h3 className="text-xl font-semibold tracking-tight">Sermon Archive</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="mr-2 h-4 w-4" /> Add Sermon
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Sermon</DialogTitle>
              <DialogDescription>
                Fill in the details for the new sermon to add it to the archive.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Sermon Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Walking in Faith" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">YouTube Summary Link</Label>
                <Input id="link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Sermon Date</Label>
                <Input id="date" type="date" value={formData.date || ""} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief summary of the sermon..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>Upload Sermon</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading sermons...</TableCell>
              </TableRow>
            ) : sermons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No sermons found.</TableCell>
              </TableRow>
            ) : sermons.map((sermon) => (
              <TableRow key={sermon.id}>
                <TableCell className="font-medium">{sermon.title}</TableCell>
                <TableCell>{sermon.date}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                  {sermon.link}
                </TableCell>
                <TableCell>
                  {sermon.isFeatured ? (
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                      Yes
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" render={<span />} />}>
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
