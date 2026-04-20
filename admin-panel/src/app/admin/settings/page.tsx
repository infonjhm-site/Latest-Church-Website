"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Lock, Calendar, Heart, Shield, Video, LayoutTemplate, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    socialLinks: { facebook: "", instagram: "", youtube: "" },
  });

  const [sections, setSections] = useState({
    heroVideo: true,
    upcomingEvents: true,
    ministries: true,
    giveBanner: true,
    featuredSermons: true,
  });

  const [siteStatus, setSiteStatus] = useState({
    maintenanceMode: false,
    registrationOpen: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In a real app we'd fetch this from the API and destructure it.
      // For the mock, we just skip re-setting everything as the defaults are fine,
      // or we can explicitly set them if desired.
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      toast.error("Failed to fetch settings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Create a combined payload that matches the mock API route requirements
      const payload = {
        ...settings,
        sections,
        siteStatus
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      toast.error("Network error while saving");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Website Control</h2>
          <p className="text-muted-foreground mt-1">Manage global settings and homepage visibility.</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-5 w-5 text-primary" />
              <CardTitle>Homepage Sections</CardTitle>
            </div>
            <CardDescription>
              Toggle which sections are currently visible on the main website homepage.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer" htmlFor="toggle-hero-video">
                  <Video className="w-4 h-4 inline-block mr-2" /> Hero Video Background
                </Label>
                <p className="text-sm text-muted-foreground">Show the fullscreen video on the landing page.</p>
              </div>
              <Switch
                id="toggle-hero-video"
                checked={sections.heroVideo}
                onCheckedChange={(c) => setSections({...sections, heroVideo: c})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer" htmlFor="toggle-sermons">
                  <Video className="w-4 h-4 inline-block mr-2" /> Featured Sermons Carousel
                </Label>
                <p className="text-sm text-muted-foreground">Display the recent sermons section.</p>
              </div>
              <Switch
                id="toggle-sermons"
                checked={sections.featuredSermons}
                onCheckedChange={(c) => setSections({...sections, featuredSermons: c})}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer" htmlFor="toggle-events">
                  <Calendar className="w-4 h-4 inline-block mr-2" /> Upcoming Events
                </Label>
                <p className="text-sm text-muted-foreground">Show the events grid on the homepage.</p>
              </div>
              <Switch 
                id="toggle-events"
                checked={sections.upcomingEvents} 
                onCheckedChange={(c) => setSections({...sections, upcomingEvents: c})} 
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer" htmlFor="toggle-ministries">Ministries List</Label>
                <p className="text-sm text-muted-foreground">Show the Life Teams preview section.</p>
              </div>
              <Switch 
                id="toggle-ministries"
                checked={sections.ministries} 
                onCheckedChange={(c) => setSections({...sections, ministries: c})} 
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
              <div className="space-y-0.5">
                <Label className="text-base cursor-pointer" htmlFor="toggle-give">Giving Banner</Label>
                <p className="text-sm text-muted-foreground">Show the giving appeal on the homepage.</p>
              </div>
              <Switch 
                id="toggle-give"
                checked={sections.giveBanner} 
                onCheckedChange={(c) => setSections({...sections, giveBanner: c})} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>Global Status</CardTitle>
              </div>
              <CardDescription>
                Manage site-wide accessibility and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-base cursor-pointer" htmlFor="toggle-maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Hide the website from public viewers.</p>
                </div>
                <Switch 
                  id="toggle-maintenance"
                  checked={siteStatus.maintenanceMode} 
                  onCheckedChange={(c) => setSiteStatus({...siteStatus, maintenanceMode: c})} 
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base text-primary cursor-pointer" htmlFor="toggle-reg">Allow New Member Registrations</Label>
                  <p className="text-sm text-muted-foreground">Enable the sign-up form on the account page.</p>
                </div>
                <Switch 
                  id="toggle-reg"
                  checked={siteStatus.registrationOpen} 
                  onCheckedChange={(c) => setSiteStatus({...siteStatus, registrationOpen: c})} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-destructive" />
                <CardTitle className="text-destructive">Admin Security</CardTitle>
              </div>
              <CardDescription>
                Manage your administrator account credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full sm:w-auto mt-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors">
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
