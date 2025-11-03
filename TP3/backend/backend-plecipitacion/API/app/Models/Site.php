<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    protected $table = "sites";

    protected $fillable = [
        "latitude",
        "longitude", 
        "zona_id",
        "precipitation_id"
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];


    public function precipitation()
    {
        return $this->belongsTo(Precipitation::class , "precipitation_id");
    }

    public function zona()
    {
        return $this->belongsTo(Zona::class, "zona_id");
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, "site_id");
    }
}

