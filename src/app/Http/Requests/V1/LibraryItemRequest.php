<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteLibraryMeta;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the ID of an existing Item from an existing Library
 * during view/update/delete the Item
 * @property int $id
 * @property int $item
 */
class LibraryItemRequest extends FormRequest
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
            'item' => $this->route('item'),
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
            'id' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        $libraryTableName = SqliteLibraryMeta::query()
            ->where('id', $idValidated['id'])
            ->pluck('tbl_name')
            ->first();
        $libraryTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $libraryTableName]);

        return [
            'item' => ['required', 'integer', 'min:1', Rule::exists($libraryTablePath, 'id')],
        ];
    }
}
