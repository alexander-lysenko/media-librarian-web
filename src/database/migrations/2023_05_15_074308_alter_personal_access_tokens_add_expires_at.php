<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private string $tableName = 'personal_access_tokens';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table($this->tableName, static function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('last_used_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table($this->tableName, static function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};