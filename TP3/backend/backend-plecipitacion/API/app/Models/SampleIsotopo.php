<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SampleIsotopo extends Model
{
    protected $table = 'sample_isotopo';

    protected $fillable = [
        'cantMilimetros',
        'valor1',
        'valor2'
     ];

    public function muestra() {
        return $this->belongsTo(Sample::class);
    }
}
