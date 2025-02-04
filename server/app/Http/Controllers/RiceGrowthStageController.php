<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RiceGrowthStages;
use Exception;

class RiceGrowthStageController extends Controller
{
    public function get_rice_land_stages_by_land_id($rice_land_id)
    {
        try {
            $stages = RiceGrowthStages::where('rice_land_id', $rice_land_id)->get();

            if ($stages->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No growth stages found for this rice land.',
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $stages,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch rice growth stages: ' . $e->getMessage(),
            ], 500);
        }
    }
}
