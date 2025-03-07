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
 *
 * @property int $libraryId - The ID of a table to get the structure from, based on an entry from SqliteLibraryMeta
 * @property int|null $libraryItemId - The ID of an existing Item
 */
class LibraryItemStructureRule implements ValidationRule
{
    /**
     * Create a new rule instance.
     * @return void
     */
    public function __construct(private readonly int $libraryId, private readonly ?int $libraryItemId = null)
    {
    }

    /**
     * Determine if the validation rule passes.
     * Example of a valid request attribute (keys may be different depending on library structure):
     * [
     *   'Movie Title' => "Лицо со шрамом (1983)",
     *   'Origin Title' => "Scarface",
     *   'Release Date' => "1983-12-01",
     *   'Description' => "In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.",
     *   'IMDB URL' => "https://www.imdb.com/title/tt0086250/",
     *   'IMDB Rating' => 8,
     *   'My Rating' => 5,
     *   'Watched' => true,
     *   'Added At' => "2020-01-01 00:00:01",
     *   'Chance To Recommend' => 5
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
        // Get the metadata of a Library
        /** @var SqliteLibraryMeta $libraryModel */
        $libraryModel = SqliteLibraryMeta::query()->where('id', $this->libraryId)->get()->first();

        // Create a set of validation rules for every field type
        $rulesDefaultSet = static::extractRules();

        // Prepare rules, fields, and attributes
        $librarySchema = json_decode($libraryModel->meta, true);
        $libraryFields = array_keys($librarySchema);
        $firstAttribute = $libraryFields[0];
        $rules = [];

        // Ensure that there are no unrecognized attributes passed
        $validatingAttributes = array_combine(array_keys($value), array_keys($value));
        Validator::make(
            $validatingAttributes,
            array_map(static fn() => [Rule::in($libraryFields)], $validatingAttributes),
            array_map(static fn() => trans('validation.custom.field_unrecognized'), $validatingAttributes),
            $validatingAttributes,
        )->validate();

        // Match attribute to type, based on Library schema
        foreach ($librarySchema as $key => $type) {
            $rules[$key] = $rulesDefaultSet[$type];
        }

        // Update validation rules for the title of a Library's entry (first field of an entry)
        // - Replace "present" with "required"
        // - Replace "nullable" with "unique"
        $tableWithConnection = implode('.', [DatabaseSwitch::CONNECTION_PATH, $libraryModel->tbl_name]);
        $uniqueRule = Rule::unique($tableWithConnection, $firstAttribute)->ignore($this->libraryItemId);

        $presentRuleKey = array_search('present', $rules[$firstAttribute], true);
        $nullableRuleKey = array_search('nullable', $rules[$firstAttribute], true);
        $rules[$firstAttribute][$presentRuleKey] = 'required';
        $rules[$firstAttribute][] = $uniqueRule;
        unset($rules[$firstAttribute][$nullableRuleKey]);

        // Perform all the validations
        Validator::make($value, $rules, static::messages(), array_combine($libraryFields, $libraryFields))->validate();
    }

    /**
     * The default validation rules for every type of field
     * @return array[]
     */
    private static function extractRules(): array
    {
        return [
            // nullable
            'line' => ['present', 'nullable', 'string', 'max:255'],
            'text' => ['present', 'nullable', 'string'],
            'url' => ['present', 'nullable', 'url', 'max:255'],
            // not-nullable
            'checkmark' => ['present', 'boolean'],
            'date' => ['present', 'date_format:Y-m-d'],
            'datetime' => ['present', 'date_format:Y-m-d H:i:s'],
            'rating5' => ['present', 'integer', 'between:0,5'],
            'rating5precision' => ['present', 'numeric', 'between:0,5'],
            'rating10' => ['present', 'integer', 'between:0,10'],
            'rating10precision' => ['present', 'numeric', 'between:0,10'],
            'priority' => ['present', 'numeric', 'between:-5,5'],
        ];
    }

    /**
     * Overridden messages for validation errors for every validation rule
     * @return array
     */
    private static function messages(): array
    {
        return [
            'boolean' => trans('validation.custom.boolean'),
            'between' => trans('validation.custom.between'),
            'date_format' => trans('validation.custom.date_format'),
            'integer' => trans('validation.custom.integer'),
            'max' => trans('validation.custom.max'),
            'numeric' => trans('validation.custom.numeric'),
            'present' => trans('validation.custom.present'),
            'string' => trans('validation.custom.string'),
        ];
    }
}
