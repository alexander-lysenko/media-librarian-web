<?php

namespace App\Rules;

use App\Models\SqliteCollectionMeta;
use Illuminate\Contracts\Validation\Rule;

/**
 * A request validation rule to check that the payload of a new collection entry
 * matches the structure of the collection the new entry will be created into.
 */
class CollectionEntryStructureRule implements Rule
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
    private int $collectionMetaId;

    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(int $collectionMetaId)
    {
        $this->collectionMetaId = $collectionMetaId;
    }

    /**
     * Determine if the validation rule passes.
     * WIP
     *
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        // validate collection id
        // get the metadata of a collection
        $collectionModel = SqliteCollectionMeta::query()
            ->where('id', '=', $this->collectionMetaId)
            ->get()
            ->first();

        // create set of validation rules for every field type
        // match-case field to type
        $collection = '';
        // var_dump($this);
        // return true;
        // {
        //"Movie Title":"line",
        //"Origin Title":"line",
        //"Release Date":"date",
        //"Description":"text",
        //"IMDB URL":"url",
        //"IMDB Rating":"rating_10stars",
        //"My Rating":"rating_5stars",
        //"Watched":"checkmark",
        //"Watched At":"datetime",
        //"Chance to Advice":"priority"
        //}

        $this->messages['fields.THE'][] = 'The';
        $this->messages['fields.THE'][] = 'Thew';
        $this->messages['VAL'] = 'validation';
        $this->messages['ERR'] = 'error';
        $this->messages[] = 'message';

        return empty($this->messages);
    }

    /**
     * Get the validation error messages.
     * @return string|array
     */
    public function message(): string|array
    {
        return $this->messages ?: "The validation has been interrupted"; // TODO: remove mock
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateLineString(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateText(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateUrl(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateDate(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateDateTime(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateCheckmark(string $fieldName, mixed $value): void
    {
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateRating5Stars(string $fieldName, mixed $value): void
    {
        if (!is_int($value)) {

        }
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validateRating10Stars(string $fieldName, mixed $value): void
    {
        if (!is_int($value)) {
        }
    }

    /**
     * @param string $fieldName
     * @param mixed $value
     * @return void
     */
    private function validatePriority(string $fieldName, mixed $value): void
    {
    }
}
