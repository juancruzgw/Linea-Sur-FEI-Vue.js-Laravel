<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SampleLevel extends Model
{
    protected $table = 'sample_Level';

    protected $fillable = ['
        levelFreatic
    '];

    public function muestra() {
        return $this->belongsTo(Sample::class);
    }
    
}
