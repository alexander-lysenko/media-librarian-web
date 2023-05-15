<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    private string $tableName = 'posters';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table($this->tableName, static function (Blueprint $table) {
            $table->renameColumn('collection_id', 'library_id');
            $table->renameColumn('entry_id', 'item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table($this->tableName, static function (Blueprint $table) {
            $table->renameColumn('library_id', 'collection_id');
            $table->renameColumn('item_id', 'entry_id');
        });
    }
};
