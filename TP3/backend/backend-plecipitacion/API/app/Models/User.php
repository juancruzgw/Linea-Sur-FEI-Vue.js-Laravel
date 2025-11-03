<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $table = "users";
    
    protected  $fillable = [
         "name" ,
         "password" ,
         "rol", 
         "report_id",
         "zona_id",
         "site_id"
    ];

    protected $hidden = [
        "created_at" ,
        "updated_at", 
    
    ];

    public function zona(){
        return $this->belongsTo(Zona::class, 'zona_id');
    }

    public function site()
    {
        return $this->belongsTo(Site::class);
    }

    public function report()
    {
        return $this->hasMany(Report::class);
    }

    public function instruments()
    {
        return $this->belongsToMany(Instrument::class, 'instrument_users', 'user_id', 'instrument_id');
    }


}
