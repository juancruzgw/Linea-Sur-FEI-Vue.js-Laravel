<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SampleChemical extends Model
{
    protected $table = 'sample_chemical';

    protected $fillable = [
        'ph',
        'conductividad',
        'concentracion_sodio
    '];

    public function muestra() {
        return $this->belongsTo(Sample::class);
    }

}
