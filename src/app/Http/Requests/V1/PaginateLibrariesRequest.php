<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteLibraryMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Request as HttpRequest;

/**
 * A request entity to validate search/sort/pagination terms passed to get a paginated view of Libraries
 */
class PaginateLibrariesRequest extends FormRequest
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
            'sort.attribute' => $this->input('sort.attribute', 'title'),
            'sort.direction' => $this->input('sort.direction', 'asc'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'sort.attribute' => ['nullable', 'required_with:sort.direction', Rule::in(['title'])],
            'sort.direction' => ['nullable', 'string', Rule::in(['asc', 'desc'])],
            'page' => ['nullable', 'integer', 'min:1'],
            'perPage' => ['nullable', 'integer', 'min:0', 'max:250'],
            'filter' => ['nullable', 'string', 'max:64'],
        ];
    }
}
