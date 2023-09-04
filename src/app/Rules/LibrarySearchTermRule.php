<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

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
     *
     * Example of a schema (keys may be different depending on library structure):
     * [
     *   "Movie Title" => "line",
     *   "Origin Title" => "line",
     *   "Release Date" => "date",
     *   "Description" => "text",
     *   "IMDB URL" => "url",
     *   "IMDB Rating" => "rating10",
     *   "My Rating" => "rating5precision",
     *   "Watched" => "checkmark",
     *   "Watched At" => "datetime",
     *   "Chance to Advice" => "priority"
     * ]
     * @var array
     * @noinspection GrazieInspection
     * @noinspection UnknownInspectionInspection
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
     * Example of a valid request attribute (keys may be different depending on library structure):
     * [
     *   'Movie Title' => ['startsWith' 'The'],
     *   'Origin Title' => [], // empty filter (also may be omitted)
     *   'Release Date' => ['greaterThan', '1999-12-31'],
     *   'Description' => ['contains', 'computer hacker'],
     *   'IMDB URL' => ['equalTo', null],
     *   'IMDB Rating' => ['between', 5, 9],
     *   'My Rating' => ['lessThan', 5],
     *   'Watched' => ['notEqualTo', false],
     *   'Watched At' => ['lessThan', '2023-01-01 00:00:00'],
     *   'Chance to Advice' => ['equalTo', '0'],
     * ]
     *
     * @param string $attribute
     * @param mixed $value
     * @param Closure $fail
     * @return void
     * @throws ValidationException
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Create a set of validation rules for every field type
        $rulesDefaultSet = static::extractTypedRules();
        $rulesOptionsSet = static::extractOptionRules();

        // Prepare rules, fields, and attributes
        $rules = [];
        $attributes = [];
        $librarySchema = $this->librarySchema;
        $libraryFields = array_keys($librarySchema);

        // Ensure that there are no unrecognized attributes passed
        $validatingAttributes = [];
        $validatingRules = [];
        $validatingMessages = [];
        foreach ($value as $field => $_) {
            $validatingAttributes[$field] = $field;
            $validatingRules["$attribute.$field"] = [Rule::in($libraryFields)];
            $validatingMessages["$attribute.$field"] = trans('validation.custom.field_unrecognized', ['attribute' => $field]);
        }
        Validator::make([$attribute => $validatingAttributes], $validatingRules, $validatingMessages)->validate();

        // Match attribute to type (wip)
        foreach ($librarySchema as $field => $type) {
            $transOptions = ['attribute' => $field];

            $rules["$attribute.$field.0"] = $rulesOptionsSet[$type];
            $rules["$attribute.$field.1"] = $rulesDefaultSet[$type];
            $rules["$attribute.$field.2"] = $rulesDefaultSet[$type];
            array_unshift($rules["$attribute.$field.2"], "required_if:$attribute.$field.0,between");

            $attributes["$attribute.$field.0"] = trans('validation.attributes.library_filter.0', $transOptions);
            $attributes["$attribute.$field.1"] = trans('validation.attributes.library_filter.1', $transOptions);
            $attributes["$attribute.$field.2"] = trans('validation.attributes.library_filter.2', $transOptions);
        }

        // Perform all the validations
        Validator::make([$attribute => $value], $rules, [], $attributes)->validate();
    }

    /**
     * The default validation rules for every type of field
     * @return array[]
     */
    private static function extractTypedRules(): array
    {
        return [
            'line' => ['string', 'max:255'],
            'text' => ['string'],
            'url' => ['string', 'max:255'],
            'checkmark' => ['boolean'],
            'date' => ['date_format:Y-m-d'],
            'datetime' => ['date_format:Y-m-d H:i:s'],
            'rating5' => ['integer', 'between:0,5'],
            'rating5precision' => ['numeric', 'between:0,5'],
            'rating10' => ['integer', 'between:0,10'],
            'rating10precision' => ['numeric', 'between:0,10'],
            'priority' => ['numeric', 'between:-5,5'],
        ];
    }

    /**
     * The available options to filter values for every type of field
     * @return array[]
     */
    private static function extractOptionRules(): array
    {
        $optionTypeMap = [
            'text' => ['equalTo', 'contains', 'doesntContain', 'startsWith', 'endsWith'],
            'bool' => ['equalTo', 'notEqualTo'],
            'date' => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
            'number' => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan', 'between'],
            'priority' => ['equalTo', 'notEqualTo', 'greaterThan', 'lessThan'],
        ];

        return [
            'line' => [Rule::in($optionTypeMap['text'])],
            'text' => [Rule::in($optionTypeMap['text'])],
            'url' => [Rule::in($optionTypeMap['text'])],
            'checkmark' => [Rule::in($optionTypeMap['bool'])],
            'date' => [Rule::in($optionTypeMap['date'])],
            'datetime' => [Rule::in($optionTypeMap['date'])],
            'rating5' => [Rule::in($optionTypeMap['number'])],
            'rating5precision' => [Rule::in($optionTypeMap['number'])],
            'rating10' => [Rule::in($optionTypeMap['number'])],
            'rating10precision' => [Rule::in($optionTypeMap['number'])],
            'priority' => [Rule::in($optionTypeMap['priority'])],
        ];
    }
}
