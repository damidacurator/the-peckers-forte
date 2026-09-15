<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('registration_fee', 15, 2)->default(0);
            $table->decimal('annual_dues', 15, 2)->default(0);
            $table->decimal('monthly_contribution', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->enum('wing', ['contribution', 'investment', 'both'])->default('both');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_categories');
    }
};
