<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->foreignId('payment_type_id')->constrained('payment_types');
            $table->decimal('amount', 15, 2);
            $table->timestamp('payment_date');
            $table->enum('payment_method', ['card', 'ussd', 'bank_transfer', 'cash']);
            $table->string('gateway', 50)->nullable();
            $table->string('gateway_reference', 100)->nullable();
            $table->string('transaction_reference', 100)->unique();
            $table->enum('status', ['pending', 'successful', 'failed', 'reversed'])->default('pending');
            $table->json('metadata')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
