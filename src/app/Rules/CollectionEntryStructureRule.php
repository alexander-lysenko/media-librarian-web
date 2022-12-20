<?php

namespace App\Rules;

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
     * Create a new rule instance.
     * @return void
     */
    public function __construct()
    {
        //
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
        // create set of validation rules for every field type
        // match-case field to type
        $collection = '';
        // var_dump($this);
        // return true;
        //

        $this->messages['fields.THE'] = 'The';
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
        return $this->messages?: "The validation has been interrupted";
    }


}
