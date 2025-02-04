<?php

namespace App\Models;

use App\Models\RiceLand;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RiceGrowthStages extends Model
{
    use HasFactory;

    protected $table = 'rice_growth_stages';

    protected $fillable = [
        'rice_land_id',
        'rice_growth_stage',
        'rice_growth_stage_start',
        'rice_growth_stage_end',
    ];

    public function riceLand()
    {
        return $this->belongsTo(RiceLand::class, 'rice_land_id');
    }
}
