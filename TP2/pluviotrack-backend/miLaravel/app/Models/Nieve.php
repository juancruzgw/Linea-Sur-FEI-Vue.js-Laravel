<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nieve extends Model
{
    //
    protected $fillable = [
        'fecha',
        'cantidad',
        'observacion',
    ];
}