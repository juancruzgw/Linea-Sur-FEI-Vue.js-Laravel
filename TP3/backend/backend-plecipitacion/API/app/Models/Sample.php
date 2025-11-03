<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sample extends Model
{
    protected $table = "sample";
    
    protected  $fillable = [
         "cota " ,
         "created_at" ,
         "updated_at" 
    ];

    public function report_regular(){
         return $this->hasOne(ReportRegular::class);
    }

     public function quimica()
    {
        return $this->hasOne(SampleChemical::class);
    }

    public function isotopo()
    {
        return $this->hasOne(SampleIsotopo::class);
    }

    public function nivel()
    {
        return $this->hasOne(SampleLevel::class);
    }

    public function caudal()
    {
        return $this->hasOne(SampleCaudal::class);
    }
}
