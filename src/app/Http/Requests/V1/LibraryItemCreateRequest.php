<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteLibraryMeta;
use App\Rules\LibraryItemStructureRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to CREATE a new Item into an existing Library
 * @property int $id
 * @property array $contents
 * @property string|null $posterUUID
 */
class LibraryItemCreateRequest extends FormRequest
{
    /**
     * Indicates whether validation should stop after the first rule failure.
     * @var bool
     */
    protected $stopOnFirstFailure = true;

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
            'id' => $this->route('id'),
        ]);
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
         * ['id' => "1"] // This is the example of a successful validation result (illustrated by field "id")
         */

        $preValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        return [
            'contents' => ['required', 'array', new LibraryItemStructureRule($preValidated['id'])],
            'posterUUID' => ['nullable', 'uuid'],
        ];
    }
}
