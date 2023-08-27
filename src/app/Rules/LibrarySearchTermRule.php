<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * A request validation rule to verify complex search term to filter items from a Library.
 * The search term must contain an object with Library attributes, available filter options and values for them.
 * Depending on the type of Library's attribute, one of the following filter options can be applied:
 * "line" => ['equalTo', 'contains', 'doesntContain', 'startsWith', 'endsWith'],
 * "text" => ['equalTo', 'contains', 'doesntContain', 'startsWith', 'endsWith'],
 * "url" => ['equalTo', 'contains', 'doesntContain', 'startsWith', 'endsWith'],
 * "checkmark" => ['equalTo', 'notEqualTo'],
 * "date" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "datetime" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "rating5" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "rating5precision" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "rating10" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "rating10precision" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
 * "priority" => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan'],
 *
 * Every attributes are limited with values (value types) applicable to the filters:
 * "line", "text", "url" => string value, max. 255 characters
 * "checkmark" => fixed value (either 'true' or 'false')
 * "date", "datetime" => string value as date format (either 'YYYY-MM-DD' or 'YYYY-MM-DD HH:mm:ss')
 * "rating5" => numeric value (from 0 to 5), whole number only
 * "rating5precision" => numeric value (from 0.0 to 5.0), 1 decimal place acceptable
 * "rating10" => numeric value (from 0 to 10), whole number only
 * "rating10precision" => numeric value (from 0.0 to 10.0), 1 decimal place acceptable
 * "priority" => numeric value (from -5 to 5), whole number only
 *
 * @noinspection GrazieInspection
 * @noinspection UnknownInspectionInspection
 */
class LibrarySearchTermRule implements ValidationRule
{
    /**
     * Schema of a Library, based on an entry from SqliteLibraryMeta.
     * The schema is an associative array of attribute=>type to be parsed for validation rules
     * @var array
     */
    private array $librarySchema;

    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(array $librarySchema)
    {
        $this->librarySchema = $librarySchema;
    }

    /**
     * Determine if the validation rule passes.
     * WIP
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {

        $attributes = array_keys($this->librarySchema);
        // Perform all the validations
        // Validator::make($value, $rules, [], $attributes)->validate();
    }

    /**
     * The default validation rules for every type of field
     * @return array[]
     */
    private static function extractRules(): array
    {
        return [
        ];
    }
}
