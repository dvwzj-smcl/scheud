<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'calendar_categories';

    public function sub_categories(){
        return $this->hasMany('App\Models\Calendar\SubCategory');
    }
}