<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('membership_number', 20)->unique()->nullable();
            $table->string('surname');
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->enum('gender', ['male', 'female']);
            $table->date('date_of_birth');
            $table->string('occupation')->nullable();
            $table->text('address');
            $table->string('state');
            $table->string('lga');
            $table->string('phone');
            $table->string('alt_phone')->nullable();
            $table->string('email');
            $table->string('passport_photo', 500)->nullable();
            $table->foreignId('membership_category_id')->constrained('membership_categories');
            $table->foreignId('branch_id')->nullable()->constrained('branches');
            $table->enum('wing', ['contribution', 'investment', 'both']);
            $table->date('registration_date')->nullable();
            $table->enum('status', ['pending', 'active', 'suspended', 'dormant', 'deceased'])->default('pending');
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->string('next_of_kin_name')->nullable();
            $table->string('next_of_kin_phone')->nullable();
            $table->string('next_of_kin_relationship')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
