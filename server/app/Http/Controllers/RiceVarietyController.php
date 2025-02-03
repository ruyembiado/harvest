<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RiceVariety;
use Exception;

class RiceVarietyController extends Controller
{
    public function get_variety_by_rice_land_id($id)
    {
        try {
            $variety = RiceVariety::where('rice_land_id', $id)->first();

            if (!$variety) {
                return response()->json([
                    'success' => false,
                    'message' => 'No rice variety found.',
                    'variety' => null, 
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Rice variety retrieved successfully.',
                'variety' => $variety,
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving rice variety.',
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    public function add_rice_variety(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'rice_land_id' => 'required|integer',
                'rice_variety_name' => 'required|string',
            ]);

            $variety = RiceVariety::create([
                'rice_land_id' => $validatedData['rice_land_id'],
                'rice_variety_name' => $validatedData['rice_variety_name'],
            ]);

            return response()->json([
                'message' => 'Rice variety added successfully',
                'variety' => $variety,
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }

    public function delete_rice_land_by_id(Request $request)
    {
        try {
            $rice_variety = RiceVariety::where('id', $request->id)
                ->where('rice_land_id', $request->rice_land_id)
                ->first();

            if (!$rice_variety) {
                return response()->json([
                    'error' => 'Rice variety not found or does not belong to the rice land.',
                ], 404);
            }

            $rice_variety->delete();

            return response()->json([
                'message' => 'Rice variety deleted successfully.',
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }
}
