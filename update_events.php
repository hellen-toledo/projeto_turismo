<?php

$pesca = App\Models\Event::find(5);
if ($pesca) {
    $pesca->cover_image = 'https://images.unsplash.com/photo-1506544777-64cfbe1142df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    $pesca->save();
    echo "Pesca updated.\n";
}

$aguas = App\Models\Event::find(12);
if ($aguas) {
    $aguas->cover_image = 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    $aguas->save();
    echo "Aguas quentes updated.\n";
}
