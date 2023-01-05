<?php

namespace App\Http\Requests\V1;

use App\Models\SqliteCollectionMeta;
use App\Rules\CollectionEntryStructureRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to create a new entry into an existing collection
 *
 * @property int $id
 * @property array $contents
 */
class CreateCollectionEntryRequest extends FormRequest
{
    /**
     * Indicates whether validation should stop after the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = false; // todo: enable it

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     *
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
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $preValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteCollectionMeta::class, 'id')],
        ]); // ['id' => "1"] // Example of the variable's value on validation succeed

        /*
         * If the above validation fails, an exception will be thrown and the rules below will never run.
         * If the above validation succeeds, the validated values may be used in the rules below.
         */

        return [
            'contents' => ['required', new CollectionEntryStructureRule($preValidated['id'])],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return array_merge(parent::messages(), [
            'id.exists' => 'The collection with provided :attribute does not exist.',
        ]);
    }
}
