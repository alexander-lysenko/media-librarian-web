<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteCollectionMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the ID of an existing entry from an existing collection
 * during view/update/delete the entry
 * WIP
 * @property int $id
 * @property int $entry
 */
class CollectionEntryRequest extends FormRequest
{
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
            'entry' => $this->route('entry'),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $collectionTableName = SqliteCollectionMeta::query()
            ->where('id', '=', $this->id)
            ->pluck('tbl_name')
            ->first();
        $collectionTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $collectionTableName]);

        return [
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteCollectionMeta::class, 'id')],
            'entry' => ['required', 'integer', 'min:1', Rule::exists($collectionTablePath, 'id')],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'id.exists' => 'The collection with provided ID does not exist.',
            'entry.exists' => 'The entry with provided ID does not exist.',
        ];
    }
}
