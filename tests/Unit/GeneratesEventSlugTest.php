<?php

namespace Tests\Unit;

use App\Application\Events\GeneratesEventSlug;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GeneratesEventSlugTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_generates_a_unique_slug_when_title_already_exists(): void
    {
        Event::factory()->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
        ]);

        $slug = app(GeneratesEventSlug::class)('Festival do Lago');

        $this->assertSame('festival-do-lago-2', $slug);
    }

    public function test_it_can_ignore_the_current_event_when_regenerating_slug(): void
    {
        $event = Event::factory()->create([
            'title' => 'Festival do Lago',
            'slug' => 'festival-do-lago',
        ]);

        $slug = app(GeneratesEventSlug::class)('Festival do Lago', ignoreId: $event->id);

        $this->assertSame('festival-do-lago', $slug);
    }
}
