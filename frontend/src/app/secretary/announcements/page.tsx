"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-muted-foreground">Broadcast messages to members</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "New Announcement"}
        </Button>
      </div>

      {showForm && (
        <Card className="shadow-sm border-brand-blue">
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Title" placeholder="e.g. Dividend Payment Notice" />
            <Textarea label="Content" placeholder="Type your message here..." className="min-h-[150px]" />
            <div className="flex justify-end pt-2">
              <Button>Post Announcement</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {[
          { title: "Upcoming General Meeting", date: "Oct 10, 2024", excerpt: "Please be informed of the AGM..." },
          { title: "New Loan Policy", date: "Sep 28, 2024", excerpt: "Members can now access up to 200%..." }
        ].map((item, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                <p className="text-gray-700">{item.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
