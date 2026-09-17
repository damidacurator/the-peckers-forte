<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Announcement;
use App\Models\Event;
use App\Models\Executive;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\EventResource;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PublicController extends Controller
{
    public function home()
    {
        return response()->json([
            'settings' => Setting::whereIn('key', ['org_name', 'tagline'])->pluck('value', 'key'),
            'announcements' => AnnouncementResource::collection(Announcement::published()->latest()->take(3)->get()),
            'upcoming_events' => EventResource::collection(Event::where('start_date', '>=', Carbon::now())->where('is_published', true)->orderBy('start_date')->take(3)->get()),
            'stats' => [
                'members' => \App\Models\Member::active()->count(),
                'established' => 2024,
            ]
        ]);
    }

    public function about()
    {
        return response()->json([
            'mission' => Setting::where('key', 'mission')->value('value'),
            'vision' => Setting::where('key', 'vision')->value('value'),
            'history' => Setting::where('key', 'history')->value('value'),
        ]);
    }

    public function executives()
    {
        $execs = Executive::where('is_current', true)->orderBy('sort_order')->get();
        return response()->json($execs);
    }

    public function announcements(Request $request)
    {
        return AnnouncementResource::collection(Announcement::published()->latest()->paginate(10));
    }

    public function events(Request $request)
    {
        return EventResource::collection(Event::where('is_published', true)->orderBy('start_date', 'desc')->paginate(10));
    }

    public function gallery(Request $request)
    {
        $albums = \App\Models\GalleryAlbum::with('images')->where('is_published', true)->latest()->paginate(10);
        return \App\Http\Resources\GalleryAlbumResource::collection($albums);
    }

    public function contact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'subject' => 'nullable|string',
            'message' => 'required|string',
        ]);

        $endpoint = config('services.formspree.endpoint', 'https://formspree.io/f/moeqgrqd');

        try {
            \Illuminate\Support\Facades\Http::timeout(10)->post($endpoint, [
                'name' => $validated['name'],
                'email' => $validated['email'],
                '_replyto' => $validated['email'],
                'subject' => $validated['subject'] ?? 'New Contact Form Inquiry - THE PECKERS FORTE',
                'message' => $validated['message'],
                'to' => 'admin@thepeckersfortelp.com',
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Formspree contact forward failed: ' . $e->getMessage());
        }

        return response()->json(['message' => 'Message sent successfully']);
    }
}
