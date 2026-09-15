<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->enum('category', ['contribution', 'investment', 'levy', 'fine', 'donation', 'registration']);
            $table->enum('wing', ['contribution', 'investment', 'both']);
            $table->boolean('is_recurring')->default(false);
            $table->enum('frequency', ['monthly', 'quarterly', 'annually', 'one_time'])->nullable();
            $table->decimal('default_amount', 15, 2)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_types');
    }
};
