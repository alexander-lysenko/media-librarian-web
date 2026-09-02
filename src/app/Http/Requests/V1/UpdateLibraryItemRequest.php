<?php

namespace App\Http\Requests\V1;

use App\Http\Middleware\DatabaseSwitch;
use App\Models\SqliteLibraryMeta;
use App\Rules\LibraryItemStructureRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A request entity to validate the data passed to UPDATE an existing Item into an existing Library
 * @property int $libraryId
 * @property int $itemId
 * @property array $contents
 * @property string|null $posterUUID
 */
class UpdateLibraryItemRequest extends FormRequest
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
            'itemId' => $this->route('item'),
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
         * ['libraryId' => "1"] // This is the example of a successful validation result (illustrated by field "id")
         */

        $idValidated = $this->validate([
            'libraryId' => ['required', 'integer', 'min:1', Rule::exists(SqliteLibraryMeta::class, 'id')],
        ]);

        $libraryTableName = SqliteLibraryMeta::query()
            ->where('id', $idValidated['libraryId'])
            ->pluck('tbl_name')
            ->first();
        $libraryTablePath = implode('.', [DatabaseSwitch::CONNECTION_PATH, $libraryTableName]);

        $itemValidated = $this->validate([
            'itemId' => ['required', 'integer', 'min:1', Rule::exists($libraryTablePath, 'id')],
        ]);

        return [
            'contents' => ['required', new LibraryItemStructureRule($idValidated['libraryId'], $itemValidated['itemId'])],
            'posterUUID' => ['nullable', 'uuid'],
        ];
    }
}
