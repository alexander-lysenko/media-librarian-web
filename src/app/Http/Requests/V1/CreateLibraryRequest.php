<?php

namespace App\Http\Requests\V1;

use App\Rules\UniqueLibraryNameRule;
use App\Utils\Enum\InputDataTypeEnum;
use App\Utils\Enum\RegexPatternsEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to CREATE a new Library
 *
 * @property string $title
 * @property array $fields
 */
class CreateLibraryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $libraryTitlePattern = RegexPatternsEnum::LIBRARY_TITLE;
        $libraryFieldPattern = RegexPatternsEnum::LIBRARY_FIELD;

        return [
            'title' => ['required', 'string', 'max:128', "regex:$libraryTitlePattern", new UniqueLibraryNameRule()],
            'fields.*' => ['required', 'array:name,type', 'max:30'],

            'fields.*.name' => ['required', 'distinct:ignore_case', "regex:$libraryFieldPattern"],
            'fields.*.type' => ['required', Rule::enum(InputDataTypeEnum::class)],
            'fields.0.type' => [Rule::enum(InputDataTypeEnum::class)->only(InputDataTypeEnum::E_LINE)],
        ];
    }
}
