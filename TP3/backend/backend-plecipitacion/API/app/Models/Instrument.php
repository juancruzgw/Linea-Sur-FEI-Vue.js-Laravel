<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instrument extends Model
{
    protected $table = "Instruments";

    protected $fillable = [
        "name",
        "brand",
        "model",
        "united_measure_id",
        "precipitation_id"
    ];

    protected $hidden = [
        "created_at" , "updated_at" , "united_measure_id" , "precipitation_id"
    ];

    // Un instrumento pertenece a una unidad de medida
    public function united_measure()
    {
        return $this->belongsTo(Unitedmeasure::class, "united_measure_id");
    }

    // Relación muchos a muchos con usuarios
    public function user()
    {
        return $this->belongsToMany(User::class, "instrument_users", "instrument_id", "user_id");
    }

    // Un instrumento puede tener muchos reportes
    public function report()
    {
        return $this->hasMany(Report::class);
    }

    public function precipitation(){
        return $this->belongsTo(Precipitation::class);
    }
}
