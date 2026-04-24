<?php

namespace App\Policies;

use App\Policies\Concerns\HandlesAdminCrudAuthorization;

class EventPolicy
{
    use HandlesAdminCrudAuthorization;
}
