<?php

namespace App\Rules;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteLibraryMeta;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * A request validation rule to check that the payload of a new Library's Item
 * matches the structure of the Library the new Item will be created into.
 */
class LibraryItemStructureRule implements ValidationRule
{
    /**
     * The ID of a table to get the structure from, based on an entry from SqliteLibraryMeta
     * @var int
     */
    private int $libraryId;

    /**
     * The ID of an existing Item.
     * It is necessary for skipping "unique" validation on update the entry, may be skipped on create a new entry
     * @var int|null
     */
    private ?int $libraryItemId;

    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(int $libraryId, ?int $libraryItemId = null)
    {
        $this->libraryId = $libraryId;
        $this->libraryItemId = $libraryItemId;
    }

    /**
     * Determine if the validation rule passes.
     * WIP
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     * @return void
     * @throws ValidationException
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Get the metadata of a collection
        /** @var SqliteLibraryMeta $collectionModel */
        $collectionModel = SqliteLibraryMeta::query()->where('id', $this->libraryId)->get()->first();

        // Create a set of validation rules for every field type
        $rulesDefaultSet = static::extractRules();

        // Prepare rules, fields and attributes
        $collectionFields = json_decode($collectionModel->meta, true);
        $collectionKeys = array_keys($collectionFields);
        $firstField = $collectionKeys[0];
        $rules = [];
        $customAttributes = array_combine($collectionKeys, $collectionKeys);

        // Match field to type
        foreach ($collectionFields as $key => $type) {
            $rules[$key] = $rulesDefaultSet[$type];
        }

        // Add the "unique" validation rule for the title of a collection's entry (first field of an entry)
        $tableWithConnection = implode('.', [DatabaseSwitch::CONNECTION_PATH, $collectionModel->tbl_name]);
        $rules[$firstField][] = Rule::unique($tableWithConnection, $firstField)
            ->ignore($this->libraryItemId);

        // Perform all the validations
        Validator::make($value, $rules, [], $customAttributes)->validate();
    }

    /**
     * The default validation rules for every type of field
     * @return array[]
     */
    private static function extractRules(): array
    {
        return [
            'line' => ['present', 'string', 'max:255'],
            'text' => ['present', 'string'],
            'url' => ['present', 'url', 'max:255'],
            'checkmark' => ['present', 'boolean'],
            'date' => ['present', 'date', 'date_format:Y-m-d'],
            'datetime' => ['present', 'date', 'date_format:Y-m-d H:i:s'],
            'rating_10stars' => ['present', 'numeric', 'between:0,10'],
            'rating_5stars' => ['present', 'numeric', 'between:0,5'],
            'priority' => ['present', 'numeric', 'between:-5,5'],
        ];
    }
}
