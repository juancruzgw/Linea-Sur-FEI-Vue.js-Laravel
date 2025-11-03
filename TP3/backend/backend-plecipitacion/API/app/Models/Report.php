<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\BreakageInstrument;

class Report extends Model
{
    protected $table = "reports";
    
    protected  $fillable = [
        "date" ,
        "note" ,
        "image", 
        "audio",
        "type",

        'user_id',
        'instrument_id',
        'precipitation_id',
        'site_id',

        "created_at",
        "updated_at" 
    ];


    protected $hidden = [
        'user_id',
        'instrument_id',
        'precipitation_id',
        'site_id',

        "created_at",
        "updated_at" 
    ];


    public function site(){
        return $this->belongsTo(Site::class, "site_id");
    }

    public function user(){
        return $this->belongsTo(User::class, "user_id");
    }

    public function instrument(){
        return $this->belongsTo(Instrument::class, "instrument_id");
    }

    public function reportRegular()
    {
        return $this->hasOne(ReportRegular::class , "report_id");
    }

    public function precipitation()
    {
        return $this->belongsTo(Precipitation::class);
    }

    
    public function breakageInstrument()
    {
        return $this->hasOne(BreakageInstrument::class, 'report_id', 'id');
    }

}
 