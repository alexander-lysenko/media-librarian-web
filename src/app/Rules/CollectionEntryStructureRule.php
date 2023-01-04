<?php

namespace App\Rules;

use App\Models\SqliteCollectionMeta;
use Illuminate\Contracts\Validation\Rule as RuleInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * A request validation rule to check that the payload of a new collection entry
 * matches the structure of the collection the new entry will be created into.
 */
class CollectionEntryStructureRule implements RuleInterface
{
    /**
     * The validation error messages.
     * @var array
     */
    protected array $messages = [];

    /**
     * The ID of a table to get the structure from, based on an entry from SqliteCollectionMeta
     * @var int
     */
    private int $collectionId;

    /**
     * The ID of an existing collection entry.
     * It is necessary for skipping "unique" validation on update the entry, may be skipped on create a new entry
     * @var int|null
     */
    private ?int $collectionEntryId;

    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(int $collectionId, ?int $collectionEntryId = null)
    {
        $this->collectionId = $collectionId;
        $this->collectionEntryId = $collectionEntryId;
    }

    /**
     * Determine if the validation rule passes.
     * WIP
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     * @throws ValidationException
     */
    public function passes($attribute, $value): bool
    {
        // Get the metadata of a collection
        /** @var SqliteCollectionMeta $collectionModel */
        $collectionModel = SqliteCollectionMeta::query()->where('id', $this->collectionId)->get()->first();

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
        $rules[$firstField][] = Rule::unique("sqlite_user_dependent.".$collectionModel->tbl_name, $firstField)
            ->ignore($this->collectionEntryId);

        // Perform all the validations
        Validator::make($value, $rules, [], $customAttributes)->validate();

        return true;
    }

    /**
     * Get the validation error messages.
     * @return string|array
     */
    public function message(): string|array
    {
        return $this->messages;
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
