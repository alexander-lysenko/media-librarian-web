<?php

namespace App\Models;

use App\Http\Middleware\DatabaseSwitch;
use App\Utils\Enum\InputDataTypeEnum as InputType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\ColumnDefinition;

/**
 * The model represents the collection metadata table. Designed for SQLite database
 *
 * @property int $id
 * @property string $tbl_name
 * @property string $schema
 * @property string $meta
 * @property string $created_at
 */
class SqliteLibraryMeta extends Model
{
    use HasFactory;

    /** @inheritdoc */
    public $fillable = [
        'tbl_name',
        'schema',
        'meta',
        'created_at',
    ];

    /** @inheritdoc */
    protected $table = 'sqlite_library_meta';

    /** @inheritdoc */
    public $timestamps = true;

    /** @inheritdoc */
    protected $connection = DatabaseSwitch::CONNECTION_PATH;

    /**
     * The method is overridden.
     * The table is designed to use only `createdAt` from the `timestamps` set.
     * The field `updatedAt` is to be ignored.
     * @inheritdoc
     * @return string|null
     */
    public function getUpdatedAtColumn(): ?string
    {
        return null;
    }

    /**
     * Allows the creating tool to map the field's input type with a specific data type.
     * Creates a table column with the specified data type depending on the field's input type.
     * @param Blueprint $table
     * @param string $name
     * @param string $type
     * @return ColumnDefinition
     */
    public static function createTableColumnByType(Blueprint $table, string $name, string $type): ColumnDefinition
    {
        return match ($type) {
            InputType::LINE => $table->string($name, 255)->nullable(),
            InputType::TEXT => $table->text($name)->nullable(),
            InputType::DATE => $table->date($name)->nullable(),
            InputType::DATETIME => $table->timestamp($name)->nullable(),
            InputType::URL => $table->string($name)->nullable(),
            InputType::CHECKBOX => $table->boolean($name)->nullable(),
            InputType::RATING_5 => $table->tinyInteger($name)->unsigned()->nullable(),
            InputType::RATING_5_PRECISION => $table->decimal($name, 2, 1)->unsigned()->nullable(),
            InputType::RATING_10 => $table->smallInteger($name)->unsigned()->nullable(),
            InputType::RATING_10_PRECISION => $table->decimal($name, 3, 1)->unsigned()->nullable(),
            InputType::PRIORITY => $table->tinyInteger($name)->nullable(),
        };
    }

    /**
     * Composes a query builder starting from a Library's table found by its ID.
     * @param int $libraryId - the Library ID from SqliteLibraryMeta
     * @return Builder - an Illuminate\Database\Query\Builder instance
     */
    public static function getLibraryTableQuery(int $libraryId): Builder
    {
        /** @var SqliteLibraryMeta $libraryMetaEntry */
        $libraryMetaEntry = static::query()->where('id', $libraryId)->first();

        return $libraryMetaEntry->getConnection()->table($libraryMetaEntry->tbl_name);
    }

    public function getItemsCount(): int
    {
        return $this->getConnection()->table($this->tbl_name)->count();
    }
}
