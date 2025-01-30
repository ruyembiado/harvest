<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiceLand extends Model
{
    use HasFactory;

    protected $table = 'rice_lands';

    protected $fillable = [
        'user_id',
        'rice_land_name',
        'rice_land_lat',
        'rice_land_long',
        'rice_land_size',
        'rice_land_condition',
        'rice_land_current_stage'
    ];
}