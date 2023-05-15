<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteLibraryMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the ID of an existing Library during view/update/delete the Library
 * @property int $id
 */
class LibraryIdRequest extends FormRequest
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
        $libraryMetaClass = SqliteLibraryMeta::class;

        return [
            'id' => ['required', 'integer', 'min:1', Rule::exists($libraryMetaClass, 'id')],
        ];
    }
}
