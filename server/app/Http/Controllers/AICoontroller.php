<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AICoontroller extends Controller
{
    public function generate_stage_growth_schedule(Request $request)
    {
        // Adjusted prompt to request detailed growth stages with dates
        $prompt = "You are an Agriculture Expert. The following are the stages of rice growth: 
    Not Yet Started, Germination, Seeding Establishment, Tillering, Panicle Initiation, Booting, Heading, Flowering, Grain Filling, and Maturity. 
    Please create a schedule for each stage with a start date and an end date. Format your response as a list of objects, where each object contains:
    - 'rice_growth_stage': the name of the stage,
    - 'rice_growth_stage_start': the start date (in YYYY-MM-DD format),
    - 'rice_growth_stage_end': the end date (in YYYY-MM-DD format).";

        try {
            // Make the API request to OpenAI
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            ])->post('https://api.openai.com/v1/completions', [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                    ['role' => 'user', 'content' => $prompt],
                ],
                'max_tokens' => 500,
                'temperature' => 0.7,
            ]);

            // Check if the response is successful
            if ($response->successful()) {
                $generatedText = $response->json()['choices'][0]['message']['content'];

                // Try to decode the generated text as JSON (assumes the AI response is formatted as JSON)
                $stages = json_decode($generatedText, true);

                return view('welcome', [
                    'generatedText' => $stages,  // Pass the data to the view
                ]);

                // Validate if the response is an array of stages
                if (is_array($stages)) {
                    return response()->json([
                        'status' => 'success',
                        'data' => $stages,
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Failed to parse the AI response into valid stages.',
                    ], 500);
                }
            } else {
                // Handle failure from the OpenAI API
                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to generate text.',
                ], 500);
            }
        } catch (\Exception $e) {
            // Handle unexpected errors
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }
}
