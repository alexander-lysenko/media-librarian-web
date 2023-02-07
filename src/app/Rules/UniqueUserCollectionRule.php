<?php

namespace App\Rules;

use App\Models\SqliteCollectionMeta;
use Illuminate\Contracts\Validation\Rule;

/**
 * A request validation rule to check that the name of a collection is unique
 */
class UniqueUserCollectionRule implements Rule
{
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
     * @param string $attribute
     * @param mixed $value
     * @return bool
     */
    public function passes($attribute, $value): bool
    {
        $sqliteCollectionMeta = new SqliteCollectionMeta();

        return !$sqliteCollectionMeta->getConnection()->getSchemaBuilder()->hasTable($value);
    }

    /**
     * Get the validation error message.
     * @return string
     */
    public function message(): string
    {
        return 'The :attribute has already been taken.';
    }
}
