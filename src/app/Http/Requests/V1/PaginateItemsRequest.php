<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteLibraryMeta;
use App\Rules\LibrarySearchTermRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate search/sort/pagination terms passed to get a paginated view of Items
 * @property int $libraryId
 */
class PaginateItemsRequest extends FormRequest
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
     * Prepare the data for validation.
     * @return void
     */
    public function prepareForValidation(): void
    {
        $this->merge([
            'libraryId' => $this->route('id'),
            'sort.attribute' => $this->input('sort.attribute', 'id'),
            'sort.direction' => $this->input('sort.direction', 'asc'),
        ]);
    }

    private array $libraryFields = [];

    /**
     * Get the validation rules that apply to the request.
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /**
         * If the upper level validation fails, an exception will be thrown and the rules below will never run.
         * If the upper level validation succeeds, the validated values may be used in the lower level rules.
         * ['id' => "1"] // This is the example of successful validation result (illustrated by field "id")
         */

        $idValidated = $this->validate([
            'libraryId' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        // Get the metadata of a Library
        /** @var SqliteLibraryMeta $libraryModel */
        $libraryModel = SqliteLibraryMeta::query()->where('id', $idValidated['libraryId'])->get()->firstOrFail();

        // Prepare rules, fields, and attributes
        $libraryMeta = json_decode($libraryModel->meta, true);
        $this->libraryFields = array_keys($libraryMeta);

        $attributesForRule = implode(',', $this->libraryFields);

        return [
            'sort' => ['nullable', 'array:attribute,direction'],
            'sort.attribute' => ['nullable', 'required_with:sort.direction', Rule::in(['id', ...$this->libraryFields])],
            'sort.direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'perPage' => ['nullable', 'integer', 'min:0', 'max:250'],
            'term' => ['nullable', "array:$attributesForRule", new LibrarySearchTermRule($libraryMeta)],
        ];
    }

    /**
     * Get custom messages for validator errors.
     * @return array
     */
    public function messages(): array
    {
        return [
            'term.array' => trans('validation.custom.term.array', [
                'values' => implode(', ', $this->libraryFields),
            ]),
        ];
    }
}
