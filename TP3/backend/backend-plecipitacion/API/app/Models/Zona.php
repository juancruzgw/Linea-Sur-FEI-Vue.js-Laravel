<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Zona extends Model
{
    protected $table = "zonas";

    protected $fillable = [
        "locality",
    ];
    

    protected $hidden = [
        'zona_id',
        'created_at',
        'updated_at',
    ];


    public function sites()
    {
        return $this->hasMany(Site::class, "zona_id");
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

}
