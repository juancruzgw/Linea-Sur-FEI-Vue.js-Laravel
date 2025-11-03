<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class InstrumentUser extends Pivot
{
    protected $table = "Instrument_users";

    protected $fillable = [
        "instrument_id",
        "user_id"
    ];

    protected $hidden = [
        "created_at" , "updated_at" 
    ];

    // relacion pivote
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function instrument()
    {
        return $this->belongsTo(Instrument::class);
    }
}
