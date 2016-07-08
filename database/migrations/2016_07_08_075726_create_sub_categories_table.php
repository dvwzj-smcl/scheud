<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('calendar_sub_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });
        Schema::table('calendar_sub_categories', function (Blueprint $table) {
            $table->integer('calendar_category_id')->unsigned();
            $table->foreign('calendar_category_id')->references('id')->on('calendar_categories')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('calendar_sub_categories');
    }
}
