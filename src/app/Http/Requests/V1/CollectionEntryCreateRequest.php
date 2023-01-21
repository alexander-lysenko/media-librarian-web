<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteCollectionMeta;
use App\Rules\CollectionEntryStructureRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to CREATE a new entry into an existing collection
 * @property int $id
 * @property array $contents
 */
class CollectionEntryCreateRequest extends FormRequest
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
         * ['id' => "1"] // Example of the result of succeeded validation (illustrated by field "id")
         */

        $preValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteCollectionMeta::class, 'id')],
        ]);

        return [
            'contents' => ['required', new CollectionEntryStructureRule($preValidated['id'])],
        ];
    }
}
