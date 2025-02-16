<?php

namespace App\Http\Controllers;

use App\Models\Advisory;
use Illuminate\Http\Request;

class AdvisoryController extends Controller
{
    public function get_advisories_today_by_land_id(Request $request)
    {
        if ($request->date == now()->toDateString()) {
            $advisories = Advisory::where('rice_land_id', $request->rice_land_id)->whereDate('date', now()->toDateString())->get();
            return response()->json($advisories);
        } else {
            return response()->json([]);
        }
    }

    public function get_all_advisories_by_land_id($rice_land_id)
    {
        try {
            $advisories = Advisory::where('rice_land_id', $rice_land_id)->get();
            return response()->json($advisories);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }
}
