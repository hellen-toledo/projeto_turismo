<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $email = $request->string('email')->toString();
        $password = $request->string('password')->toString();

        $user = User::query()->where('email', $email)->first();

        if (! $user || ! Hash::check($password, $user->password) || ! $user->is_admin) {
            return response()->json([
                'message' => 'Invalid admin credentials.',
            ], 422);
        }

        Auth::guard('web')->login($user);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        $token = $user->createToken(
            $request->string('deviceName')->toString() ?: 'admin-api',
            ['admin']
        )->plainTextToken;

        return response()->json([
            'token' => $token,
            'tokenType' => 'Bearer',
            'user' => new AdminUserResource($user),
        ]);
    }

    public function me(Request $request): AdminUserResource
    {
        return new AdminUserResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
