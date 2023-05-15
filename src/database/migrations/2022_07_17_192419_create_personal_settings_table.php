<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private string $tableName = 'personal_settings';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create($this->tableName, static function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('locale', 5)->default('en');
            $table->string('theme')->default('light');
            $table->jsonb('metadata')->nullable();
            $table->longText('avatar')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table($this->tableName, static function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIfExists();
        });
    }
};
