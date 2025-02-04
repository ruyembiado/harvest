<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Http;
use App\Models\RiceGrowthStages;
use Carbon\Carbon;

class AICoontroller extends Controller
{
    public function generate_stage_growth_schedule(Request $request)
    {
        $crop_type = $request->rice_variety_name;
        $rice_land_id = $request->rice_land_id;
        $today = Carbon::today()->toDateString();

        // Updated prompt
        $prompt = "You are an Agriculture Expert. $today, I planted my $crop_type crop. The following are the stages of rice growth of $crop_type: 
    Germination, Seeding Establishment, Tillering, Panicle Initiation, Booting, Heading, Flowering, Grain Filling, and Maturity. 
    Please create a schedule for each stage with a start date and an end date.
    Format your response as a JSON array where each object contains:
    - 'rice_growth_stage': (string) name of the stage,
    - 'rice_growth_stage_start': (string) YYYY-MM-DD start date,
    - 'rice_growth_stage_end': (string) YYYY-MM-DD end date.
    
    ONLY return pure JSON, no explanations, no extra text.";

        try {
            // Call OpenAI API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(30)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => 500,
                    'temperature' => 0.7,
                ]);

            // Check API success response
            if ($response->successful()) {
                $data = $response->json();

                // Log entire OpenAI response
                \Log::info('OpenAI Response:', $data);

                // Ensure response contains valid choices
                if (!isset($data['choices'][0]['message']['content'])) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'No valid response from AI.',
                    ], 500);
                }

                $generatedText = $data['choices'][0]['message']['content'];

                // Log raw AI response before JSON parsing
                \Log::info('AI Raw Response (Before JSON Decode):', ['response' => $generatedText]);

                // **Fix: Remove Markdown formatting** (Improved regex)
                $generatedText = preg_replace('/^```json\s*|\s*```$/', '', trim($generatedText));

                // Ensure response is not empty
                if (empty($generatedText)) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'AI response is empty.',
                    ], 500);
                }

                // Decode JSON response
                $stages = json_decode($generatedText, true);

                // **Validate JSON decoding**
                if (json_last_error() !== JSON_ERROR_NONE) {
                    \Log::error('JSON Decode Error:', ['error' => json_last_error_msg()]);
                    return response()->json([
                        'status' => 'error',
                        'message' => 'JSON decoding failed: ' . json_last_error_msg(),
                    ], 500);
                }

                $this->store_generated_growth_stages($rice_land_id, $stages);

                // Log parsed JSON
                \Log::info('Parsed AI Response:', $stages);

                // Pass data to Blade view
                return response()->json([
                    'status' => 'success',
                    'message' => 'Growth stage schedule generated successfully.',
                ], 200);
            } else {
                // Log API errors
                \Log::error('OpenAI API Error:', $response->json());

                return response()->json([
                    'status' => 'error',
                    'message' => 'Failed to generate text from OpenAI API.',
                ], 500);
            }
        } catch (\Exception $e) {
            // Log exceptions
            \Log::error('Exception:', ['message' => $e->getMessage()]);

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store_generated_growth_stages($rice_land_id, $stages)
    {
        foreach ($stages as $stage) {
            RiceGrowthStages::create([
                'rice_land_id' => $rice_land_id,
                'rice_growth_stage' => $stage['rice_growth_stage'],
                'rice_growth_stage_start' => $stage['rice_growth_stage_start'],
                'rice_growth_stage_end' => $stage['rice_growth_stage_end'],
            ]);
        }
    }
}
