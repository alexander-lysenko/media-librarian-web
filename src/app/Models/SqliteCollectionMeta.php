<?php

namespace App\Models;

use App\Http\Middleware\DatabaseSwitch;
use App\Utils\Enum\InputDataTypeEnum;
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
class SqliteCollectionMeta extends Model
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
    protected $table = 'sqlite_collection_meta';

    /** @inheritdoc */
    public $timestamps = true;

    /** @inheritdoc */
    protected $connection = DatabaseSwitch::CONNECTION_PATH;

    /**
     * The method is overridden. The table is designed to use only `createdAt` from `timestamps` set.
     * The field `updatedAt` is to be ignored.
     * @inheritdoc
     * @return string|null
     */
    public function getUpdatedAtColumn(): ?string
    {
        return null;
    }

    /**
     * Allows the collection creating tool to map the field's input type with a specific data type.
     * Creates a table column with the specified data type depending on the field's input type.
     * @param Blueprint $table
     * @param string $name
     * @param string $type
     * @return ColumnDefinition
     */
    public static function createTableColumnByType(Blueprint $table, string $name, string $type): ColumnDefinition
    {
        return match ($type) {
            InputDataTypeEnum::LINE_INPUT => $table->lineString($name)->nullable(),
            InputDataTypeEnum::TEXT_INPUT => $table->text($name)->nullable(),
            InputDataTypeEnum::DATE_INPUT => $table->date($name)->nullable(),
            InputDataTypeEnum::DATETIME_INPUT => $table->timestamp($name)->nullable(),
            InputDataTypeEnum::URL_INPUT => $table->string($name)->nullable(),
            InputDataTypeEnum::CHECKBOX_INPUT => $table->boolean($name)->nullable(),
            InputDataTypeEnum::RATING5_INPUT => $table->unsignedTinyInteger($name)->nullable(),
            InputDataTypeEnum::RATING10_INPUT => $table->unsignedSmallInteger($name)->nullable(),
            InputDataTypeEnum::PRIORITY_INPUT => $table->tinyInteger($name)->nullable(),
        };
    }

    /**
     * Composes a query builder starting from a collection table found by its ID.
     * @param int $collectionId - the collection ID from SqliteCollectionMeta
     * @return Builder - an Illuminate\Database\Query\Builder instance
     */
    public static function getCollectionTableQuery(int $collectionId): Builder
    {
        /** @var SqliteCollectionMeta $collectionMetaEntry */
        $collectionMetaEntry = static::query()->where('id', $collectionId)->first();

        return $collectionMetaEntry->getConnection()->table($collectionMetaEntry->tbl_name);
    }
}
