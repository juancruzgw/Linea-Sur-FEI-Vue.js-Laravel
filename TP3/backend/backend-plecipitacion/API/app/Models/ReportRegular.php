<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportRegular extends Model
{
    protected $table = "report_regulars";
    
    protected  $fillable = [
         "amount" ,

         "united_measure_id",
         "sample_id",
         "report_id",

         "created_at" ,
         "updated_at" 
    ];
    
    protected $hidden = [
         "united_measure_id",
         "sample_id",
         "report_id",

         "created_at", 
         "updated_at"
    ];

    public function united_measure(){
         return $this->belongsTo(UnitedMeasure::class , "united_measure_id");
    }

     public function users(){
         return $this->belongsTo(User::class , "user_id");
    }

    public function sample(){
         return $this->belongsTo(Sample::class , "sample_id");
    }

    public function report(){
         return $this->belongsTo(Report::class , "report_id");
    }

}
