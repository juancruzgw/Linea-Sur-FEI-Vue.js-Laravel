<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Precipitation extends Model
{
    protected $table = "precipitations";
    
    protected  $fillable = [
        "type"
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function intrument(){
        return $this->hasOne(Instrument::class);
    }

    public function site()
    {
        return $this->hasMany(Site::class);
    }
    
    public function report()
    {
        return $this->hasMany(Report::class);
    }


}
