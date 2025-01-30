<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use App\Models\RiceLand;

class RiceLandController extends Controller
{
    public function add_rice_land(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'rice_land_name' => 'required|string',
                'rice_land_lat' => 'required|string',
                'rice_land_long' => 'required|string',
                'rice_land_size' => 'required|string',
                'rice_land_condition' => 'required|string',
                'rice_land_current_stage' => 'required|string',
            ]);

            $user = RiceLand::create([
                'user_id' => $request->user_id,
                'rice_land_name' => $validatedData['rice_land_name'],
                'rice_land_lat' => $validatedData['rice_land_lat'],
                'rice_land_long' => $validatedData['rice_land_long'],
                'rice_land_size' => $validatedData['rice_land_size'],
                'rice_land_condition' => $validatedData['rice_land_condition'],
                'rice_land_current_stage' => $validatedData['rice_land_current_stage'],
            ]);

            return response()->json([
                'message' => 'Land rice added successfully',
                'user' => $user,
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    public function get_rice_lands_by_user_id($user_id)
    {
        try {
            $rice_lands = RiceLand::where('user_id', $user_id)->get();
            return response()->json([
                'message' => 'Retrieved all rice lands',
                'lands' => $rice_lands,
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    public function delete_rice_land_by_id($id, $user_id)
    {
        try {
            $rice_land = RiceLand::where('id', $id)
                ->where('user_id', $user_id)
                ->first();

            if (!$rice_land) {
                return response()->json([
                    'error' => 'Rice land not found or does not belong to the user.',
                ], 404);
            }

            $rice_land->delete();

            return response()->json([
                'message' => 'Rice land deleted successfully.',
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }
}
