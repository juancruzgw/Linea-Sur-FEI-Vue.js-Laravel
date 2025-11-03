<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BreakageInstrument extends Model
{
    protected $table = "breakage_instruments";

    protected $fillable = [
        "damage" , 
        "description",
        
        "report_id"
    ];

    protected $hidden = [
        "report_id",

        "updated_at",
        "created_at"
    ];


    public function report(){
         return $this->belongsTo(Report::class);
    }
}
