<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiceVariety extends Model
{
    use HasFactory;

    protected $table = 'rice_varieties';

    protected $fillable = [
        'rice_land_id',
        'rice_variety_name',
    ];
}
