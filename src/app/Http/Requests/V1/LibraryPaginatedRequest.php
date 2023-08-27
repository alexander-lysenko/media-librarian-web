<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteLibraryMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate search/sort/pagination terms passed to get a paginated view of a Library
 * @property int $id
 */
class LibraryPaginatedRequest extends FormRequest
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
        $this->merge(['id' => $this->route('id')]);
    }

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
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        // Get the metadata of a Library
        /** @var SqliteLibraryMeta $libraryModel */
        $libraryModel = SqliteLibraryMeta::query()->where('id', $idValidated['id'])->get()->first();

        // Prepare rules, fields, and attributes
        $libraryFields = json_decode($libraryModel->meta, true);
        $attributes = array_keys($libraryFields);

        return [
            'sort' => ['nullable', 'array:attribute,direction'],
            'sort.attribute' => ['nullable', 'required_with:sort.direction', 'string', Rule::in($attributes)],
            'sort.direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'perPage' => ['nullable', 'integer', 'min:0', 'max:250'],
        ];
    }
}
