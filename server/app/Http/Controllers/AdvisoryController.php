<?php

namespace App\Http\Controllers;

use App\Models\Advisory;
use Illuminate\Http\Request;

class AdvisoryController extends Controller
{
    public function get_advisories_today(Request $request)
    {
        $advisories = Advisory::where('rice_land_id', $request->rice_land_id)->whereDate('date', now()->toDateString())->get();
        return response()->json($advisories);
    }

}
