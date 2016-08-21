<?php

namespace App\Http\Controllers\Schedule;

use App\Models\Calendar\Category;
use App\Models\Calendar\Event;
use App\Models\Calendar\Slot;
use App\Models\Calendar\SubCategory;
use App\Models\User\Customer;
use App\Models\User\Doctor;
use Carbon\Carbon;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use BF;
use DB;
use Input;

class ScheduleController extends Controller
{
    public function init()
    {
        // todo: remove commented code
        $doctors = Doctor::with('user')->get()->keyBy('id');
        $categories = Category::with('sub_categories')->get()->keyBy('id');

        // lookup for SubCategory name (1)
        $nameLookup = static::getSubCategoryNames();

        foreach ($doctors as $doctor) {
            $data = json_decode($doctor->data);

            // attach SubCategory name (2)
            foreach ($data->categories as $category) {
                foreach ($category->sub_categories as $sub) {
                    $sub->name = $nameLookup[$sub->category_id][$sub->sub_category_id];
                }
            }
            $doctor->categories = $data->categories;
            $doctor['name'] = $doctor->user->name;
            unset($doctor['data']);
        }
        $response = [
            'doctors' => $doctors,
            'categories' => $categories
        ];
        return BF::result(true, $response, '[schedule] init');
    }

    public function getOrganizerEvents()
    {
        Carbon::setWeekStartsAt(Carbon::SUNDAY);
        Carbon::setWeekEndsAt(Carbon::SATURDAY);
        try {
            $pendingEvents = Event::where('start', '>', Carbon::now()->addDay(-1))->where('status', 'pending')->with('slot.doctor')->orderBy('start')->get();
            $doctors = Doctor::with('user')->select('id', 'user_id')->get()->keyBy('id');

            foreach($doctors as $doctor) {
                $doctor['name'] = $doctor['user']['name'];
                $doctor['pending'] = ['count' => 0, 'items' => []];
                unset($doctor['user']);
            }
            $doctors = $doctors->toArray();
            foreach($pendingEvents as $event) {
                $doctor_id = $event->slot->doctor->id;
                $week = Carbon::parse($event->start)->startOfWeek()->timestamp;
                if(!isset($doctors[$doctor_id]['pending']['items'][$week])) {
                    $doctors[$doctor_id]['pending']['items'][$week] = 0;
                }
                $doctors[$doctor_id]['pending']['items'][$week]++;
                $doctors[$doctor_id]['pending']['count']++;
            }
            return BF::result(true, ['list' => array_values($doctors)]);
        } catch (\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function getDoctorSlots($doctor_id)
    {
        try {
            // parse date
            if (empty(Input::get('date'))) $date = Carbon::now();
            else $date = Carbon::parse(Input::get('date'));

            $mode = Input::get('mode');
            $query = Slot::with('category')->where('sc_doctor_id', $doctor_id);
            if (empty($mode)) {
                $query->byDate($date);
            } else {
                if ($mode == 'previous') $query->previous($date);
                else $query->next($date);
            }
            $slots = $query->get();
            $slots = array_map(function ($slot) {
                $slot['title'] = $slot['category']['name'];
                unset($slot['category']);
                return $slot;
            }, $slots->toArray());
            return BF::result(true, ['slots' => $slots], '[schedule] get slot');
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    public function getDoctorSlotsWithEvents($doctor_id, $dateParam = null)
    {
        try {
            $isOrganizer = BF::isOrganizer();
            // parse date
            if (empty($dateParam)) $date = Carbon::now();
            else $date = Carbon::parse($dateParam);
            $date2 = clone $date;

            if (Input::has(['start', 'end'])) {
                $start = Carbon::createFromTimestamp(Input::get('start'));
                $end = Carbon::createFromTimestamp(Input::get('end'));
                $query = Slot::with('category')->byDate($start, $end)->where('sc_doctor_id', $doctor_id);
            } else {
                $query = Slot::with('category')->byDate($date)->where('sc_doctor_id', $doctor_id);
            }

            $slots = $query->get();
            $events = [];
            $self_id = BF::getUserId();
            $nameLookup = static::getSubCategoryNames();

            foreach ($slots as $slot) {
                $slot->title = $slot->category->name;
                foreach ($slot->events as $event) {
                    $customer = null;
                    if ($isOrganizer || $self_id == $event->sale_id) {
                        $customer = $event->customer->toArray();
                    }
                    $events[] = [
                        'event_id' => $event->id,
                        'start' => $event->start,
                        'end' => $event->end,
                        'sale_id' => $event->sale_id,
                        'slot_id' => $event->sc_slot_id,
                        'category_id' => $slot->category->id,
                        'sub_category_id' => $event->sc_sub_category_id,
                        'status' => $event->status,
                        'title' => $nameLookup[$slot->category->id][$event->sc_sub_category_id],
                        'customer' => $customer
                    ];
                }
                unset($slot['category']);
                unset($slot['events']);
            }
            return BF::result(true, ['slots' => $slots, 'events' => $events, 'time' => $date2], '[schedule] get slot');
        }catch(\Exception $e){
            return BF::result(false, $e->getMessage());
        }
    }

    // for internal use only
    private function getSubCategoryNames()
    {
        $categories = Category::with('sub_categories')->get();
        $categoryLookup = [];
        foreach ($categories as $cat) {
            $names = [];
            foreach ($cat->sub_categories as $sub) {
                $names[$sub->id] = $sub->name;
            }
            $categoryLookup[$cat->id] = $names;
        }
        return $categoryLookup;
    }

    // not being used, reserved for future use.
    public function getCategorySlots($doctor_id)
    {
        // todo: doing
        // $slots = Doctor::with('slots.category')->find($doctor_id)->slots;
        $slots = Slot::with('category')
            ->where('sc_doctor_id', $doctor_id)
            ->where('start', '<', Carbon::now()->addMonth())
            ->where('start', '>', Carbon::now()->addMonth(-1))
            ->get();
        $slots = array_map(function ($slot) {
            $slot['title'] = $slot['category']['name'];
            unset($slot['category']);
            return $slot;
        }, $slots->toArray());
        return BF::result(true, ['slots' => $slots], '[schedule] get slot');
    }
}
