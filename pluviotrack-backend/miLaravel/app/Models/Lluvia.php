<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lluvia extends Model
{
    //
    protected $fillable = [
        'fecha',
        'cantidad',
        'observacion',
    ];
}