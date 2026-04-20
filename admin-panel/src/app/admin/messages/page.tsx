"use client";

import { useState, useEffect } from "react";
import { Mail, BadgeCheck, HandHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { MessageItem } from "@/lib/api/db"; // Changed import for MessageItem

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]); // Changed items to messages, initialMessages removed
  const [activeTab, setActiveTab] = useState<"all" | "contact" | "prayer">("all");
  const [isLoading, setIsLoading] = useState(true); // Added isLoading state

  const fetchMessages = async () => { // Added fetchMessages function
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { // Added useEffect to fetch messages on mount
    fetchMessages();
  }, []);

  const toggleStatus = async (id: string, type: "contact" | "prayer") => { // Updated toggleStatus to be async and use API
    try {
      const itemToUpdate = messages.find(item => item.id === id);
      if (!itemToUpdate) return;

      let updatedStatus;
      if (type === "contact") {
        updatedStatus = { resolved: !itemToUpdate.resolved };
      } else { // type === "prayer"
        updatedStatus = { prayed: !itemToUpdate.prayed };
      }

      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStatus),
      });

      if (!res.ok) {
        throw new Error("Failed to update message status");
      }

      // Re-fetch messages to get the latest state from the server
      fetchMessages();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const filteredMessages = messages.filter(item => activeTab === "all" || item.type === activeTab); // Changed filteredItems to filteredMessages

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
          <p className="text-muted-foreground mt-1">Manage contact form messages and prayer requests.</p>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "contact" | "prayer")}> {/* Replaced div with Tabs */}
        <TabsList className="grid w-full grid-cols-3 sm:w-auto"> {/* Replaced div with TabsList */}
          <TabsTrigger value="all">All Messages</TabsTrigger>
          <TabsTrigger value="contact">
            <Mail className="w-4 h-4 mr-2" /> Contact Forms
          </TabsTrigger>
          <TabsTrigger value="prayer">
            <HandHeart className="w-4 h-4 mr-2" /> Prayer Requests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="m-0 mt-6">
          <div className="grid gap-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading inbox...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/20">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((item) => (
                <Card key={item.id} className={item.resolved || item.prayed ? 'opacity-70 bg-muted/50' : 'border-l-4 border-l-primary'}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <CardTitle className="text-lg">{item.subject}</CardTitle>
                          {item.type === 'prayer' && item.confidential && (
                            <Badge variant="destructive" className="ml-2">Confidential</Badge>
                          )}
                          {item.type === 'prayer' && !item.confidential && (
                            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">Prayer Request</Badge>
                          )}
                          {item.type === 'contact' && (
                            <Badge variant="outline" className="ml-2">Contact Form</Badge>
                          )}
                        </div>
                        <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1">
                          <span className="font-medium text-foreground">{item.sender}</span>
                          {item.email && <span>{item.email}</span>}
                          <span className="text-muted-foreground/80">{item.date}</span>
                        </CardDescription>
                      </div>
                      <div className="shrink-0">
                        <Button 
                          variant={item.resolved || item.prayed ? "outline" : "default"} 
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => toggleStatus(item.id, item.type)}
                        >
                          {item.type === "contact" ? (
                            item.resolved ? <><BadgeCheck className="w-4 h-4 mr-2" /> Resolved</> : "Mark Resolved"
                          ) : (
                            item.prayed ? <><BadgeCheck className="w-4 h-4 mr-2" /> Prayed For</> : "Mark Prayed"
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm border-l-2 border-muted pl-4 py-1 whitespace-pre-wrap">{item.message}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
