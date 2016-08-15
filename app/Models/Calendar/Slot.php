<?php

namespace App\Models\Calendar;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Slot extends Model
{
    protected $table = 'sc_slots';
    protected $fillable = ['start', 'end', 'sc_doctor_id', 'created_by', 'sc_category_id'];

    protected $dates = ['start', 'end'];

    public function doctor(){
        return $this->belongsTo('App\Models\User\Doctor', 'sc_doctor_id');
    }
    public function organizer(){
        return $this->belongsTo('App\Models\User\User', 'created_by');
    }
    public function category(){
        return $this->belongsTo('App\Models\Calendar\Category', 'sc_category_id');
    }
    public function doctor_category(){
        return $this->belongsTo('App\Models\Calendar\DoctorCategory', 'sc_doctor_category_id');
    }
    public function events(){
        return $this->hasMany('App\Models\Calendar\Event', 'sc_slot_id');
    }

    public function scopeNext($query, $startDate){
        $limit = clone $startDate;
        return $query->where('start', '>', $startDate)->where('start', '<', $limit->addMonth());
    }
    public function scopePrevious($query, $startDate){
        $limit = clone $startDate;
        return $query->where('start', '<', $startDate)->where('start', '>', $limit->addMonth(-1));
    }
    public function scopeByDate($query, $queryDate){
        $weekCount = 4;
        
        // always start on sunday and end on saturday & no last week
        Carbon::setWeekStartsAt(Carbon::SUNDAY);
        Carbon::setWeekEndsAt(Carbon::SATURDAY);

        $thisWeekSunday = Carbon::now()->startOfWeek();
        $querySunday = $queryDate->startOfWeek()->addWeeks(-$weekCount);
        $start = ($querySunday < $thisWeekSunday) ? $thisWeekSunday : $querySunday;
        $end = clone $start;
        $end->addWeeks($weekCount*2);
        return $query->where('start', '>', $start)->where('start', '<', $end)->orderBy('start');
    }
    //public function doctor_category(){
        //dd($this);
        //dd($this->sc_doctor_id);
        //return $this->hasMany('App\Models\Calendar\DoctorCategory', 'sc_category_id', 'sc_category_id')->where('sc_doctor_id', $this->sc_doctor_id);
        //return $this->sc_category_id;
    //}

    /*
    public function response(){
        $events = [];
        $events[] = [
            'start' => $this->start,
            'end' => $this->end,
            'color' => $this->is_full() ? 'red' : 'green',
            'rendering' => 'background'
        ];
        foreach($this->events as $event){
            $sale = $event->sale ? [
                'id' => $event->sale->id,
                'name' => $event->sale->user->name
            ] : null;
            $customer = $event->customer ? [
                'id' => $event->customer->id,
                'name' => $event->customer->name,
                'hn' => $event->customer->hn,
                'phone' => $event->customer->phone,
                'contact' => $event->customer->contact
            ] : null;
            $events[] = [
                'id' => $event->id,
                'start' => $this->start,
                'end' => $this->end,
                'title' => $event->sub_category->name,
                'color' => $event->color(),
                'sale' => $sale,
                'customer' => $customer,
                'borderColor' =>  '#000',
                'textColor' => '#000'
            ];
        }
        $durations = $this->durations();
        $doctor = [
            'id' => $this->doctor->id,
            'name' => $this->doctor->user->name
        ];
        $organizer = [
            'id' => $this->organizer->id,
            'name' => $this->organizer->user->name
        ];
        return [
            'events' => $events,
            'slot' => [
                'id' => $this->id,
                'start' => $this->start,
                'end' => $this->end,
                'doctor' => $doctor,
                'organizer' => $organizer,
                'durations' => $durations,
                'events' => $events,
                'categories' => $this->categories()
            ]
        ];
    }
    public function durations(){
        $start = Carbon::parse($this->start);
        $end = Carbon::parse($this->end);
        $max_duration = $start->diffInMinutes($end);
        $current_duration = 0;
        foreach($this->events as $event){
            $current_duration += $event->duration();
        }
        $min_duration = 0;
        foreach($this->slot_categories as $slot_category){
            foreach($slot_category->categories as $category){
                foreach($category->sub_categories as $sub){
                    $duration = $this->doctor->sub_categories->where('sc_sub_category_id', $sub->id)->first()->duration;
                    if($min_duration==0 || $duration<$min_duration){
                        $min_duration = $duration;
                    }
                }
            }
        }
        return [
            'current' => $current_duration,
            'left' => $max_duration-$current_duration,
            'min' => $min_duration,
            'max' => $max_duration
        ];
    }
    public function is_full(){
        $durations = $this->durations();
        return ($durations['current']+$durations['min'])>$durations['max'];
    }
    */
    /*
    public function categories(){
        $start = Carbon::parse($this->start);
        $end = Carbon::parse($this->end);
        $max_duration = $start->diffInMinutes($end);
        $summary_duration = 0;
        foreach($this->events as $event){
            $summary_duration += $event->duration();
        }
        $available = [];
        foreach($this->slot_categories as $slot_category){
            foreach($slot_category->categories as $category){
                $item =  [
                    'id' => $category->id,
                    'name' => $category->name,
                    'sub_categories' => []
                ];
                foreach($category->sub_categories as $sub){
                    $duration = $this->doctor->sub_categories->where('sc_sub_category_id', $sub->id)->first()->duration;
                    if($max_duration-$duration>=0){
                        $item['sub_categories'][] = [
                            'id' => $sub->id,
                            'name' => $sub->name,
                            'duration' => $duration
                        ];
                    }
                }
                $available[] = $item;
            }
        }
        foreach($available as $i => $item){
            if(count($item['sub_categories'])==0) unset($available[$i]);
        }
        return $available;
    }
    */
}
