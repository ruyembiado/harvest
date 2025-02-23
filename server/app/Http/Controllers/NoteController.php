<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($rice_land_id)
    {
        $notes = Note::where('rice_land_id', $rice_land_id)->get();
        return response()->json($notes);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'rice_land_id' => 'required',
                'title' => 'required',
                'content' => 'required|array', 
            ]);

            // Ensure content is stored as JSON
            $note = Note::create([
                'rice_land_id' => $validatedData['rice_land_id'],
                'title' => $validatedData['title'],
                'content' => json_encode($validatedData['content']), // Convert array to JSON
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Note added successfully',
                'note' => $note,
            ], 200);
        } catch (Exception $ex) {
            return response()->json([
                'error' => $ex->getMessage(),
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        //
    }
}
