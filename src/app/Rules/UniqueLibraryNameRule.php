<?php

namespace App\Rules;

use App\Models\SqliteLibraryMeta;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * A request validation rule to check that the name of a Library is unique within a User's collection
 */
class UniqueLibraryNameRule implements ValidationRule
{
    /**
     * Run the validation rule.
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $sqliteLibraryMeta = new SqliteLibraryMeta();

        if ($sqliteLibraryMeta->getConnection()->getSchemaBuilder()->hasTable($value)) {
            $fail ('The :attribute has already been taken.');
        }
    }
}
