<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteCollectionMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the ID of an existing entry from an existing collection
 * during view/update/delete the entry
 * @property int $id
 * @property int $entry
 */
class CollectionEntryRequest extends FormRequest
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
            'entry' => $this->route('entry'),
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

        $idValidated = $this->validate([
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteCollectionMeta::class, 'id')],
        ]);

        $collectionTableName = SqliteCollectionMeta::query()
            ->where('id', $idValidated['id'])
            ->pluck('tbl_name')
            ->first();
        $collectionTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $collectionTableName]);

        return [
            'entry' => ['required', 'integer', 'min:1', Rule::exists($collectionTablePath, 'id')],
        ];
    }
}
