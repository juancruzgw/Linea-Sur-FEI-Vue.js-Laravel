<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SampleCaudal extends Model
{
    protected $table = 'sample_caudal';

    protected $fillable = ['caudal'];

    public function muestra() {
        return $this->belongsTo(Sample::class);
    }
}
