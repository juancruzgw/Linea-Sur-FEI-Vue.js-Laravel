<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnitedMeasure extends Model
{
    protected $table = "united_measures";
    
    protected  $fillable = [
         "valueMeasure" ,
         "abbreviation"  
    ];

    protected $hidden = [
        "created_at", 
        "updated_at"
    ];

    public function report_regular(){
         return $this->hasOne(ReportRegular::class);
    }

    public function instrument(){
        return $this->hasOne(Instrument::class);
    }

}
