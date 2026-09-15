<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_path', 500);
            $table->bigInteger('file_size')->nullable();
            $table->enum('category', ['constitution', 'minutes', 'report', 'policy', 'other'])->default('other');
            $table->enum('wing', ['contribution', 'investment', 'both', 'all'])->default('all');
            $table->boolean('is_public')->default(false);
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
